
import { NextRequest, NextResponse } from 'next/server';
import {db} from '@/lib/db';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { JSONLoader, JSONLinesLoader } from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { auth } from '@clerk/nextjs/server';

const pc = new Pinecone();
const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

const loaderMapping: { [key: string]: (path: string) => any } = {
  '.pdf': (path: string) => new PDFLoader(path),
  '.json': (path: string) => new JSONLoader(path, '/texts'),
  '.jsonl': (path: string) => new JSONLinesLoader(path, '/html'),
  '.txt': (path: string) => new TextLoader(path),
  '.csv': (path: string) => new CSVLoader(path, 'text'),
};

export const POST = async (req: NextRequest) => {
  const { userId: clerkUserId } = await auth();
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];
  const integrationId = formData.get('integrationId') as string;

  if (!files.length) {
    return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
  }

  if (!clerkUserId) {
    return NextResponse.json({ message: 'Clerk User ID is required' }, { status: 400 });
  }

  const tempDir = tmpdir();
  const uploadedFiles = [];

  try {
    let totalFileSize = 0;

    for (const file of files) {
      const extension = path.extname(file.name).toLowerCase();
      if (!loaderMapping[extension]) {
        return NextResponse.json({ message: `Unsupported file type: ${file.name}` }, { status: 400 });
      }

      const tempFilePath = path.join(tempDir, file.name);
      await fs.writeFile(tempFilePath, Buffer.from(await file.arrayBuffer()));
      uploadedFiles.push({ path: tempFilePath, extension });

      const fileSize = Buffer.byteLength(await file.arrayBuffer());
      totalFileSize += fileSize;

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileHash = createHash('md5').update(fileBuffer).digest('hex');
      const existingFile = await db.document.findFirst({
        where: {
          name: file.name,
          size: fileSize,
          hash: fileHash,
        },
      });

      if (existingFile) {
        return NextResponse.json({
          message: `File ${file.name} already exists. Do you want to upload it again?`,
        });
      }

      // Load and process the file based on its extension
      const loader = loaderMapping[extension](tempFilePath);
      const docs = await loader.load();

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocs = await textSplitter.splitDocuments(docs);

      // Create embeddings and store in Pinecone
      const vectorStore = await PineconeStore.fromDocuments(
        splitDocs,
        new OpenAIEmbeddings(),
        { pineconeIndex, namespace: integrationId }
      );
      await vectorStore.addDocuments(splitDocs);

      await db.document.create({
        data: {
          name: file.name,
          size: fileSize,
          uploadedDate: new Date(),
          integrationId,
          hash: fileHash,
          type: 'FILE',
        },
      });
    }

    return NextResponse.json({ message: 'Upload and processing successful' });
  } catch (error: any) {
    console.error('Error processing file:', error);
    return NextResponse.json({ message: 'Error processing file' }, { status: 500 });
  } finally {
    // Clean up temporary files
    for (const { path: tempFilePath } of uploadedFiles) {
      await fs.unlink(tempFilePath);
    }
  }
};