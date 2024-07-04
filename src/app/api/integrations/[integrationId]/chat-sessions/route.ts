import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { integrationId: string } }) {
  const { integrationId } = params;

  try {
    const chatSessions = await db.chatSession.findMany({
      where: { integrationId },
    });
    return new Response(JSON.stringify(chatSessions), { status: 200 });
  } catch (error: any) {
    console.error('Error fetching chat sessions:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
