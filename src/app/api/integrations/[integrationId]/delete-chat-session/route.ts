import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { integrationId: string } }) {
  const { integrationId } = params;
  const { chatSessionId } = await req.json();

  if (!integrationId || typeof integrationId !== 'string') {
    return NextResponse.json({ error: 'Invalid or missing integrationId' }, { status: 400 });
  }

  if (!chatSessionId || typeof chatSessionId !== 'string') {
    return NextResponse.json({ error: 'Invalid or missing chatSessionId' }, { status: 400 });
  }

  try {
    // Delete the chat session from the database
    await prisma.chatSession.delete({
      where: {
        id: chatSessionId,
      },
    });

    return NextResponse.json({ message: 'Chat session deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return NextResponse.json({ error: 'Failed to delete chat session' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
