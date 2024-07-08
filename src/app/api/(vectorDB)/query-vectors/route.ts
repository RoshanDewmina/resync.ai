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
    const { clerkUserId, queryVector, topK } = await req.json();

    // Ensure user exists
    const user = await checkUserExists(clerkUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!queryVector || !Array.isArray(queryVector) || queryVector.length === 0) {
        return NextResponse.json({ error: 'Query vector is required' }, { status: 400 });
    }

    const topKResults = topK || 3; // Default topK to 3 if not provided

    // Initialize vector store
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        model: "text-embedding-3-large",
      }),
        { pineconeIndex, namespace: clerkUserId }
    );

    // Perform the query
    const results = await vectorStore.similaritySearch(queryVector.toString(), topKResults);

    // Return the query results
    return NextResponse.json({ results }, { status: 200 });
  } catch (error: any) {
    // Handle errors
    console.error('Error querying vectors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
