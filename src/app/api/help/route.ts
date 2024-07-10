// app/api/help/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, content } = await req.json();

    if (!email || !content) {
      return NextResponse.json({ error: 'Email and content are required' }, { status: 400 });
    }

    const newEntry = await db.help.create({
      data: {
        email,
        content,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating entry' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
