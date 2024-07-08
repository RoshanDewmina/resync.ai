

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processQuery } from '@/lib/langchain';
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { checkUserByClerkUserId, checkUserExists } from '@/lib/accountUtils';
import { auth } from '@clerk/nextjs/server';



const pc = new Pinecone();
const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

export async function POST(request: Request, { params }: { params: { chatSessionId: string } }) {
  try {

    const {userId : clerkUserId} = auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: 'No userId found' }, { status: 400 });
    }

const user = await checkUserByClerkUserId(clerkUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { chatSessionId } = params;
    const { integration_id, message,chat_mode } = await request.json();

     // Determine token cost based on chat mode
 let TOKENS_PER_QUESTION;
 if (chat_mode === 'ADVANCED') {
   TOKENS_PER_QUESTION = 40; // Adjusted token cost for GPT-4
 } else {
   TOKENS_PER_QUESTION = 15; // Adjusted token cost for GPT-3.5
 }

    // Deduct tokens
    await db.user.update({
      where: { id: user.id },
      data: { tokens: { decrement: TOKENS_PER_QUESTION } },
    });

    // Log token usage
    await db.tokenUsage.create({
      data: {
        userId: user.id,
        tokens: TOKENS_PER_QUESTION,
        reason: 'Question asked in chat session',
      },
    });
    // Validate input
    if (!integration_id || !message || !message.role || !message.content) {
      return NextResponse.json({ error: 'Integration ID and message (with role and content) are required' }, { status: 400 });
    }

    // Find the chat session
    const chatSession = await db.chatSession.findUnique({
      where: { id: chatSessionId },
      include: { messages: true },
    });

    if (!chatSession) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    // Find the integration
    const integration = await db.integration.findUnique({
      where: { id: integration_id },
    });

    if (!integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    // Add the new user message to the chat session
    try {
      await db.message.create({
        data: {
          chatSessionId,
          role: message.role,
          content: message.content,
          recordsCited: message.recordsCited || null,
        },
      });
    } catch (error: any) {
      console.error('Error adding user message:', error);
      return NextResponse.json({ error: 'Error adding user message' }, { status: 500 });
    }

    // Initialize vector store
    let vectorStore;
    try {
      vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({
          model: "text-embedding-3-large",
        }),
        { pineconeIndex, namespace: integration.id }
      );
    } catch (error: any) {
      console.error('Error initializing vector store:', error);
      return NextResponse.json({ error: 'Error initializing vector store' }, { status: 500 });
    }

    // Process the new query
    let response;
    try {
      response = await processQuery(message.content, vectorStore, chatSessionId,chat_mode);
    } catch (error: any) {
      console.error('Error processing query:', error);
      return NextResponse.json({ error: 'Error processing query' }, { status: 500 });
    }

    // Add the response to the chat session
    let assistantMessage;
    try {
      assistantMessage = await db.message.create({
        data: {
          chatSessionId,
          role: 'assistant',
          content: response,
          recordsCited: undefined,
        },
      });

      return NextResponse.json({
        chat_session_id: chatSessionId,
        message: assistantMessage,
      });
    } catch (error: any) {
      console.error('Error creating assistant message:', error);
      return NextResponse.json({ error: 'Error creating assistant message' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error continuing chat session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
