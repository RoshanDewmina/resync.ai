// api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {auth} from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  // const clerkUserId = req.headers.get('x-clerk-user-id');
  const {userId : clerkUserId} = auth()
  

  if (!clerkUserId) {
    return NextResponse.json({ error: 'Clerk User ID is required' }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: { projects: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log(user)

    return NextResponse.json(user.projects, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
