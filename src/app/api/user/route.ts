import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming you have a db module to interact with your database
import {auth } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  try {
    // Get the authenticated Clerk user ID
   const {userId : clerkUserId} = auth();

   if(!clerkUserId) {
    return
   }


    // Fetch user data from the database
    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: {
        Storage: true,
        TokenUsage: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate total storage usage
    const totalStorageUsed = user.Storage.reduce((acc, storage) => acc + storage.storageUsed, 0);

    // Calculate total tokens
    const totalTokens = user.TokenUsage.reduce((acc, usage) => acc + usage.tokens, 0);

    // Return user data
    return NextResponse.json({
      storageUsage: totalStorageUsed,
      tokenCount: totalTokens,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
