// // api/chat-sessions/[chatSessionId]/route.ts
// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { processQuery } from '@/lib/langchain';
// import { PineconeStore } from "@langchain/pinecone";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { checkUserExists } from '@/lib/accountUtils';

// const pc = new Pinecone();
// const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

// const TOKENS_PER_QUESTION = 10;

// export async function GET(req: Request, { params }: { params: { chatSessionId: string } }) {
//   const { chatSessionId } = params;

//   try {
//     const chatSession = await db.chatSession.findUnique({
//       where: { id: chatSessionId },
//       include: { messages: true, },
//     });

//     if (!chatSession) {
//       return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
//     }

//     return NextResponse.json({ messages: chatSession.messages }, { status: 200 });
//   } catch (error: any) {
//     console.error('Error fetching chat session:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// export async function POST(request: Request, { params }: { params: { chatSessionId: string } }) {
//   try {
//     // const authorization = request.headers.get('authorization');
//     // const apiKey = authorization?.replace('Bearer ', '');

//     // if (!apiKey) {
//     //   return NextResponse.json({ error: 'API key is required' }, { status: 400 });
//     // }
    

//     // // Validate user
//     // const user = await checkUserExists(apiKey);
//     // if (!user) {
//     //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     // }


//     const { chatSessionId } = params;

//     const integration = await db.integration.findFirst({
//       where: { chatSessions: { some: { id: chatSessionId } } },
//     });

//     // const integrationId = awit db.chatSession.findUnique({
//     //   where: { id: chatSessionId },
//     //   select: { integrationId: true },
//     // });

//     // const { integrationId, message, stream } = await request.json();
//     const { message, stream } = await request.json();

//     // Validate input
//     if (!integration || !message || !chatSessionId) {
//       return NextResponse.json({ error: 'Integration ID, message, and chat session ID are required' }, { status: 400 });
//     }

//     // **Find the chat session and include related integration, project, and user**
//     const chatSession = await db.chatSession.findUnique({
//       where: { id: chatSessionId },
//       include: {
//         integration: {
//           include: {
//             project: {
//               include: {
//                 user: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!chatSession) {
//       return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
//     }

//     // **Extract the user from the chat session**
//     const user = chatSession.integration.project.user;
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     // Check if the user has enough credits
//     const userData = await db.user.findUnique({
//       where: { id: user.id },
//       select: { credits: true },
//     });

//     if (!userData || userData.credits < TOKENS_PER_QUESTION) {
//       return NextResponse.json({ error: 'Not enough credits. Please upgrade your plan.' }, { status: 402 }); // Payment Required status
//     }

//     // Deduct tokens
//     await db.user.update({
//       where: { id: user.id },
//       data: { credits: { decrement: TOKENS_PER_QUESTION } },
//     });

//     // Log token usage
//     await db.tokenUsage.create({
//       data: {
//         userId: user.id,
//         tokens: TOKENS_PER_QUESTION,
//         reason: 'Question asked in chat session',
//       },
//     });



//     // Add the new user message to the chat session
//     try {
//       await db.message.create({
//         data: {
//           chatSessionId,
//           role: message.role,
//           content: message.content,
//           recordsCited: message.recordsCited || null,
//         },
//       });
//     } catch (error: any) {
//       console.error('Error adding user message:', error);
//       return NextResponse.json({ error: 'Error adding user message' }, { status: 500 });
//     }

//     // Initialize vector store
//     let vectorStore;
//     try {
//       vectorStore = await PineconeStore.fromExistingIndex(
//         new OpenAIEmbeddings(),
//         { pineconeIndex, namespace: integration.id }
//       );
//     } catch (error: any) {
//       console.error('Error initializing vector store:', error);
//       return NextResponse.json({ error: 'Error initializing vector store' }, { status: 500 });
//     }

//     // Process the new query
//     let response;
//     try {
//       response = await processQuery(message.content, vectorStore, chatSessionId);
//     } catch (error: any) {
//       console.error('Error processing query:', error);
//       return NextResponse.json({ error: 'Error processing query' }, { status: 500 });
//     }

//     // Add the response to the chat session
//     try {
//       const assistantMessage = await db.message.create({
//         data: {
//           chatSessionId,
//           role: 'assistant',
//           content: response,
//           recordsCited: undefined,
//         },
//       });

//       return NextResponse.json({
//         chat_session_id: chatSessionId,
//         message: assistantMessage,
//       });
//     } catch (error: any) {
//       console.error('Error creating assistant message:', error);
//       return NextResponse.json({ error: 'Error creating assistant message' }, { status: 500 });
//     }
//   } catch (error: any) {
//     console.error('Error continuing chat session:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// api/chat-sessions/[chatSessionId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processQuery } from '@/lib/langchain';
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { checkUserExists } from '@/lib/accountUtils';
import { checkPrivileges, trackUsage } from '@/lib/privileges';

const pc = new Pinecone();
const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

const TOKENS_PER_QUESTION = 10;

export async function GET(req: Request, { params }: { params: { chatSessionId: string } }) {
  const { chatSessionId } = params;

  try {
    const chatSession = await db.chatSession.findUnique({
      where: { id: chatSessionId },
      include: { messages: true },
    });

    if (!chatSession) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    return NextResponse.json({ messages: chatSession.messages }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { chatSessionId: string } }) {
  try {
    const authorization = request.headers.get('authorization');
    const apiKey = authorization?.replace('Bearer ', '');

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }
    
    const { chatSessionId } = params;

    const integration = await db.integration.findFirst({
      where: { chatSessions: { some: { id: chatSessionId } } },
    });

    const { message, stream } = await request.json();

    // Validate input
    if (!integration || !message || !chatSessionId) {
      return NextResponse.json({ error: 'Integration ID, message, and chat session ID are required' }, { status: 400 });
    }

    // Find the chat session and include related integration, project, and user
    const chatSession = await db.chatSession.findUnique({
      where: { id: chatSessionId },
      include: {
        integration: {
          include: {
            project: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    // Extract the user from the chat session
    const user = chatSession.integration.project.user;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user has enough credits
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { credits: true },
    });

    if (!userData || userData.credits < TOKENS_PER_QUESTION) {
      return NextResponse.json({ error: 'Not enough credits. Please upgrade your plan.' }, { status: 402 }); // Payment Required status
    }

    // Check if the user can ask questions
    const canAskQuestions = await checkPrivileges(user.clerkUserId, "maxQuestionsPerMonth");
    if (!canAskQuestions) {
      return NextResponse.json({ error: 'Your plan does not allow asking questions.' }, { status: 403 });
    }

    // Track usage of tokens and questions
    await trackUsage(user.clerkUserId, TOKENS_PER_QUESTION, 1);

    // Deduct tokens
    await db.user.update({
      where: { id: user.id },
      data: { credits: { decrement: TOKENS_PER_QUESTION } },
    });

    // Log token usage
    await db.tokenUsage.create({
      data: {
        userId: user.id,
        tokens: TOKENS_PER_QUESTION,
        reason: 'Question asked in chat session',
      },
    });

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
        new OpenAIEmbeddings(),
        { pineconeIndex, namespace: integration.id }
      );
    } catch (error: any) {
      console.error('Error initializing vector store:', error);
      return NextResponse.json({ error: 'Error initializing vector store' }, { status: 500 });
    }

    // Process the new query
    let response;
    try {
      response = await processQuery(message.content, vectorStore, chatSessionId);
    } catch (error: any) {
      console.error('Error processing query:', error);
      return NextResponse.json({ error: 'Error processing query' }, { status: 500 });
    }

    // Add the response to the chat session
    try {
      const assistantMessage = await db.message.create({
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
