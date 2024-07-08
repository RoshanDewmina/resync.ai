// api/upload/all-files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: NextRequest, { params }: { params: { integrationId: string } })=> {
  
    const { integrationId } = params;
  try {
    // Fetch the list of files from the database
    const files = await db.document.findMany({
        where: { integrationId },
        orderBy: { uploadedDate: 'desc' },
    });

        if (!files) {
            return NextResponse.json({ error: 'No files found' }, { status: 404 });
        }


    // Map the files to their details
    const fileDetails = files.map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
      icon: file.icon,
      size: file.size,
      uploadedDate: file.uploadedDate.toISOString(),
      maxDepth: file.maxDepth,
      excludeDirs: file.excludeDirs,
    }));



    return NextResponse.json(fileDetails);
  } catch (error) {
    console.error('Failed to fetch uploaded files', error);
    return NextResponse.json({ error: 'Failed to fetch uploaded files' }, { status: 500 });
  }
};
