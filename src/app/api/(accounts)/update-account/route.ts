import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { userId, email, plan, firstName, lastName, imageUrl } = await req.json() as {
      userId: string;
      email?: string;
      plan?: string;
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
    };

    // Validate input
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if the user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user information
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        email: email || user.email,
        plan: plan ? plan as any : user.plan,
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
        imageUrl: imageUrl ?? user.imageUrl,
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
