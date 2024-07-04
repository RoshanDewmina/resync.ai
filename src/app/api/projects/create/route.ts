// api/projects/create/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const {userId : clerkUserId} = auth()

    if (!name || !clerkUserId) {
      return new Response(JSON.stringify({ error: 'Name and Clerk User ID are required' }), { status: 400 });
    }

    // Find the user by Clerk User ID
    const user = await db.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Create a new project
    const newProject = await db.project.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify(newProject), { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
