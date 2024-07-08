import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processQuery } from '@/lib/langchain';
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { checkUserByClerkUserId, checkUserExists } from '@/lib/accountUtils';

import {auth} from "@clerk/nextjs/server"

const pc = new Pinecone();
const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

export async function POST(request: Request) {
  try {

    const {userId : clerkUserId} = auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: 'No userId found' }, { status: 400 });
    }

const user = await checkUserByClerkUserId(clerkUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { integration_id, guidance, context, messages, tags, chat_mode } = await request.json();

    // Validate input
    if (!integration_id) {
      return NextResponse.json({ error: 'Integration ID is required' }, { status: 400 });
    }


    // Check if the user has enough tokens
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { tokens: true },
    });

     // Determine token cost based on chat mode
 let TOKENS_PER_QUESTION;
 if (chat_mode === 'ADVANCED') {
   TOKENS_PER_QUESTION = 40; // Adjusted token cost for GPT-4
 } else {
   TOKENS_PER_QUESTION = 15; // Adjusted token cost for GPT-3.5
 }


    if (!userData || userData.tokens === null || userData.tokens < TOKENS_PER_QUESTION) {
      return NextResponse.json({ error: 'Not enough tokens. Please upgrade your plan.' }, { status: 402 }); // Payment Required status
    }

    // Deduct tokens
    await db.user.update({
      where: { id: user.id },
      data: { tokens: { decrement: TOKENS_PER_QUESTION } },
    });

    // Record token usage
    await db.tokenUsage.create({
      data: {
        userId: user.id,
        tokens: TOKENS_PER_QUESTION,
        reason: 'Question asked',
      },
    });

    // Find or create integration
    const integration = await db.integration.findUnique({
      where: { id: integration_id },
    });

    if (!integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    // Create a new chat session
    const newChatSession = await db.chatSession.create({
      data: {
        integrationId: integration_id,
        guidance: guidance || null,
        context: context || null,
        tags: tags || [],
        chatMode: chat_mode || null,
      },
    });

    // Add initial messages to the chat session if provided
    if (messages && messages.length > 0) {
      for (const msg of messages) {
        await db.message.create({
          data: {
            chatSessionId: newChatSession.id,
            role: msg.role,
            content: msg.content,
          },
        });
      }
    }

    // Initialize vector store if there are user messages to process
    let assistantMessage = null;
    const userMessage = messages?.find((msg: any) => msg.role === 'user');
    if (userMessage) {
      try {
        const vectorStore = await PineconeStore.fromExistingIndex(
          new OpenAIEmbeddings({
            model: "text-embedding-3-large",
          }),
          { pineconeIndex, namespace: integration.id }
        );
        const response = await processQuery(userMessage.content, vectorStore, newChatSession.id, chat_mode);
        assistantMessage = await db.message.create({
          data: {
            chatSessionId: newChatSession.id,
            role: 'assistant',
            content: response,
          },
        });
      } catch (error: any) {
        console.error('Error processing query:', error);
        return NextResponse.json({ error: 'Error processing query' }, { status: 500 });
      }
    }

    return NextResponse.json({
      chat_session_id: newChatSession.id,
      message: assistantMessage,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating chat session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
