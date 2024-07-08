import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { getTokenBalance } from '@/lib/tokenUtils';

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the token balance for the authenticated user
    const tokenCount = await getTokenBalance(clerkUserId);

    // Fetch the total number of questions
    const totalQuestions = await db.questionUsage.count();

    // Fetch the most frequently asked questions
    const frequentlyAskedQuestions = await db.message.groupBy({
      by: ['content'],
      _count: { content: true },
      orderBy: { _count: { content: 'desc' } },
      take: 5,
    });

    // Fetch the number of projects created
    const totalProjects = await db.project.count();

    // Fetch monthly asked questions
    const monthlyQuestions = await db.questionUsage.groupBy({
      by: ['month', 'year'],
      _sum: { questions: true },
      orderBy: { month: 'asc' },
    });

    return NextResponse.json({
      totalQuestions,
      frequentlyAskedQuestions,
      totalProjects,
      monthlyQuestions,
      tokenCount,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ error: 'Error fetching analytics data' }, { status: 500 });
  }
}
