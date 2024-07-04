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
    const { clerkUserId } = await req.json();

    // Ensure user exists
    const user = await checkUserExists(clerkUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize vector store
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex, namespace: clerkUserId }
    );

    // Retrieve vector IDs
    const indexStats = await pineconeIndex.describeIndexStats();
    const namespaceStats = indexStats.namespaces ? indexStats.namespaces[clerkUserId] : undefined;
    const vectors = namespaceStats?.recordCount || 0;

    const results = await pineconeIndex.listPaginated();
    // console.log(results);


    // Return the vector count
    return NextResponse.json({ vectors, results }, { status: 200 });
  } catch (error: any) {
    // Handle errors
    console.error('Error listing vectors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
