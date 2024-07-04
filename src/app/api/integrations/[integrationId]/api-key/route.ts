import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { integrationId: string } }) {
  const { integrationId } = params;

  try {
    const integration = await db.integration.findUnique({
      where: { id: integrationId },
      select: { apiKey: true },
    });

    if (!integration) {
      return new Response(JSON.stringify({ error: 'Integration not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ apiKey: integration.apiKey }), { status: 200 });
  } catch (error: any) {
    console.error('Error fetching API key:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
