// api/user/tokens
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Authenticate the user
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the token balance for the authenticated user
    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: { tokens: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const balance = user.tokens ?? 0; // Default to 0 if tokens is null or undefined

    // Respond with the token balance as a number
    return NextResponse.json({ balance });
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
