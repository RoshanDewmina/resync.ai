
// // api/chat-sessions/route.ts
// import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server';
// import { db } from '@/lib/db';

// const TOKENS_PER_QUESTION = 10;

// export async function GET(req: Request) {
//   try {
//     // Get the currently logged-in user
//     const { userId } = auth();

//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Find the user in the database
//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });


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


//     // Fetch chat sessions for the current user
//     const chatSessions = await db.chatSession.findMany({
//       where: {
//         integration: {
//           project: {
//             userId: user.id,
//           },
//         },
//       },
//       include: {
//         integration: {
//           include: {
//             project: true,
//           },
//         },
//         messages: true,
//       },
//     });

//     return NextResponse.json(chatSessions, { status: 200 });
//   } catch (error: any) {
//     console.error('Error fetching chat sessions:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// api/chat-sessions/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { checkPrivileges, trackUsage } from '@/lib/privileges';

const TOKENS_PER_QUESTION = 10;

export async function GET(req: Request) {
  try {
    // Get the currently logged-in user
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user in the database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

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

    // Fetch chat sessions for the current user
    const chatSessions = await db.chatSession.findMany({
      where: {
        integration: {
          project: {
            userId: user.id,
          },
        },
      },
      include: {
        integration: {
          include: {
            project: true,
          },
        },
        messages: true,
      },
    });

    return NextResponse.json(chatSessions, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
