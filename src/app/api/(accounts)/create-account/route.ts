import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { email, plan, clerkUserId, firstName, lastName, imageUrl } = await req.json() as {
      email: string;
      plan: string;
      clerkUserId: string;
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
    };

    // Validate input
    if (!email || !plan || !clerkUserId) {
      return NextResponse.json({ error: 'Email, plan, and clerkUserId are required' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create a new user
    const newUser = await db.user.create({
      data: {
        email,
        plan: plan as any,
        clerkUserId,
        firstName,
        lastName,
        imageUrl,
        credits: 150, // Initialize credits
        createdAt: new Date(),
      },
    });

    // Initialize storage for the new user
    await db.storage.create({
      data: {
        userId: newUser.id,
        storageUsed: 0,
      }
    });

    // Return success response
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    // Handle any errors that occur during the operation
    console.error('Error creating user account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
