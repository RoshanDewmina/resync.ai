// api/projects/delete/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(req: Request) {
  try {
    const { integrationId } = await req.json();
    const { userId: clerkUserId } = auth();

    if (!integrationId || !clerkUserId) {
      return new Response(JSON.stringify({ error: 'Name and Clerk User ID are required' }), { status: 400 });
    }

    // Find the user by Clerk User ID
    const user = await db.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Delete the project
    const deletedIntegration = await db.integration.deleteMany({
      where: {
        id: integrationId
      },
    });

    if (deletedIntegration.count === 0) {
      return new Response(JSON.stringify({ error: 'Project not found or already deleted' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Deleted Project" }), { status: 200 });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
