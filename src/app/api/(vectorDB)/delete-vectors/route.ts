import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { checkUserExists } from '@/lib/accountUtils';

const pc = new Pinecone();
const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { clerkUserId, vectorIds } = await req.json();

    // Ensure user exists
    const user = await checkUserExists(clerkUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!vectorIds || !Array.isArray(vectorIds) || vectorIds.length === 0) {
      return NextResponse.json({ error: 'Vector IDs are required' }, { status: 400 });
    }

    // Initialize vector store
    const embeddings = new OpenAIEmbeddings();
    const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });

    // Delete the vectors
    await pineconeStore.delete({
      ids: vectorIds,
      namespace: clerkUserId
    });

    // Return success response
    return NextResponse.json({ message: 'Vectors deleted successfully' }, { status: 200 });
  } catch (error: any) {
    // Handle errors
    console.error('Error deleting vectors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
