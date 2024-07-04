import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
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
      orderBy: {  month: 'asc' },
    });

    return NextResponse.json({
      totalQuestions,
      frequentlyAskedQuestions,
      totalProjects,
      monthlyQuestions,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ error: 'Error fetching analytics data' }, { status: 500 });
  }
}
