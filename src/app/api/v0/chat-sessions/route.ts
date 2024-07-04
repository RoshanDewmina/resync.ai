import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processQuery } from '@/lib/langchain';
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { checkUserExists } from '@/lib/accountUtils';
import { checkPrivileges, trackUsage, trackStorageUsage } from '@/lib/privileges';

const pc = new Pinecone();
const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

const TOKENS_PER_QUESTION = 10;

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    const apiKey = authorization?.replace('Bearer ', '');

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Validate user
    const user = await checkUserExists(apiKey);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user has the privilege to ask questions
    const canAskQuestions = await checkPrivileges(user.clerkUserId, "maxQuestionsPerMonth");
    if (!canAskQuestions) {
      return NextResponse.json({ error: 'Your plan does not allow asking questions.' }, { status: 403 });
    }

    // Check if the user has enough credits
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { credits: true },
    });

    if (!userData || userData.credits < TOKENS_PER_QUESTION) {
      return NextResponse.json({ error: 'Not enough credits. Please upgrade your plan.' }, { status: 402 }); // Payment Required status
    }

    // Track usage of tokens and questions
    await trackUsage(user.clerkUserId, TOKENS_PER_QUESTION, 1);

    // Deduct tokens
    await db.user.update({
      where: { id: user.id },
      data: { credits: { decrement: TOKENS_PER_QUESTION } },
    });

    const { integration_id, guidance, context, messages, tags, chat_mode, stream } = await request.json();

    // Validate input
    if (!integration_id) {
      return NextResponse.json({ error: 'Integration ID is required' }, { status: 400 });
    }

    // Find or create integration
    const integration = await db.integration.findUnique({
      where: { id: integration_id },
    });

    if (!integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    // Check if the user has the privilege to use the integration
    const canUseIntegration = await checkPrivileges(user.clerkUserId, "maxIntegrationsPerProject");
    if (!canUseIntegration) {
      return NextResponse.json({ error: 'Your plan does not allow this many integrations.' }, { status: 403 });
    }

    // Create a new chat session
    const newChatSession = await db.chatSession.create({
      data: {
        integrationId: integration_id,
        guidance: guidance || null,
        context: context || null,
        tags: tags || [],
        chatMode: chat_mode || null,
        stream: stream || false,
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
          new OpenAIEmbeddings(),
          { pineconeIndex, namespace: integration.id }
        );
        const response = await processQuery(userMessage.content, vectorStore, newChatSession.id);
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
