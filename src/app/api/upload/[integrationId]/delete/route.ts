import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

export async function DELETE(req: NextRequest,  { params }: { params: { integrationId: string } }) {

  const { integrationId } = params;

  
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }
    const ns = pineconeIndex.namespace(integrationId)
    // const embeddings = new OpenAIEmbeddings();
    // const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });

    // await pineconeStore.delete({
    //   ids: [id],
    // });

    await ns.deleteOne(id);

    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
  }
}

// export const config = {
//   runtime: 'edge',
// };
