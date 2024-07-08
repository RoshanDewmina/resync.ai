import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user and retrieve the Clerk user ID
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Parse the request body
    const { email, firstName, lastName } = await req.json();

    // Check if the user exists
    const user = await db.user.findUnique({
      where: { id: clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user information
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        email: email || user.email,

        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,

      },
    });

    // Return success response
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: any) {
    // Handle any errors that occur during the operation
    console.error('Error updating user account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
