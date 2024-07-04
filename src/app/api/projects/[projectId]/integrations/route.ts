// api/projects/[projectId]/integrations/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  const { projectId } = params;

  try {
    const integrations = await db.integration.findMany({
      where: { projectId },
    });
    return new Response(JSON.stringify(integrations), { status: 200 });
  } catch (error: any) {
    console.error('Error fetching integrations:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
