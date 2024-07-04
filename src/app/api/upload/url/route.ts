import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getFavicon } from '@/utils/getFavicon';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const urlUploadSchema = z.object({
  integrationId: z.string().min(1),
  url: z.string().url(),
  maxDepth: z.union([z.string(), z.number()]).optional(), // Ensure both string and number are handled
  excludeDirs: z.union([z.string(), z.array(z.string())]).optional(), // Handle both string and array
});

export const POST = async (req: NextRequest) => {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await req.json();
    const { integrationId, url, maxDepth, excludeDirs } = body;

    console.log('Request body:', body);

    const validationResult = urlUploadSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    // if (!clerkUserId) {
    //   return NextResponse.json({ message: 'Clerk User ID is required' }, { status: 400 });
    // }

    const favicon = await getFavicon(url);
    const existingUrl = await db.document.findFirst({
      where: {
        url,
        integrationId,
      },
    });

    if (existingUrl) {
      return NextResponse.json({
        message: `URL ${url} already exists. Do you want to upload it again?`,
      });
    }

    // Process maxDepth and excludeDirs correctly
    const depth = maxDepth ? Number(maxDepth) : null;
    const dirs = excludeDirs ? (Array.isArray(excludeDirs) ? excludeDirs : [excludeDirs]) : [];

    // Add logic to process the URL and create embeddings (omitted here)

    await db.document.create({
      data: {
        name: url,
        url,
        icon: favicon,
        uploadedDate: new Date(),
        integrationId,
        maxDepth: depth,
        excludeDirs: dirs,
        type: 'URL',
      },
    });

    return NextResponse.json({ message: 'URL upload and processing successful' });
  } catch (error: any) {
    console.error('Error processing URL:', error);
    return NextResponse.json({ message: 'Error processing URL' }, { status: 500 });
  }
};
