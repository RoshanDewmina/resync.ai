// api/projects/[projectId]/integrations/create/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const { name, type } = await req.json();
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


  try {
    const integrationId = uuidv4();
    const newIntegration = await db.integration.create({
      data: {
        
        id: integrationId,
        projectId,
        name: name,
        apiKey: uuidv4(),
        type: type || 'Web',
      },
    });
    return new Response(JSON.stringify(newIntegration), { status: 200 });
  } catch (error: any) {
    console.error('Error generating integration ID:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
