import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { integrationId: string } }) {
  const { integrationId } = params;

  try {
    const body = await req.json();
    const { name } = body;
    
    const newChatSession = await db.chatSession.create({
      data: {
        name,
        integration: { connect: { id: integrationId } },
      },
    });

    return new Response(JSON.stringify(newChatSession), { status: 200 });
  } catch (error: any) {
    console.error('Error creating chat session:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
