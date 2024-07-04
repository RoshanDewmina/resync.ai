import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { email } = await req.json() as { email: string };

    // Validate input
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if the user exists in the database
    const user = await db.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;

    // Delete the user's usage and storage records
    await db.tokenUsage.deleteMany({
      where: { userId },
    });
    await db.storage.deleteMany({
      where: { userId },
    });

    // Delete the user account
    await db.user.delete({
      where: { id: userId },
    });

    // Return success response
    return NextResponse.json({ message: 'User account deleted successfully' }, { status: 200 });
  } catch (error: any) {
    // Handle any errors that occur during the operation
    console.error('Error deleting user account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}