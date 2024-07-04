// src/lib/langchain.ts

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { formatDocumentsAsString } from "langchain/util/document";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { compile } from "html-to-text";
import { db } from '@/lib/db'; // Import your database client

const pc = new Pinecone();
const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

/**
 * Load and process documents from a URL.
 * @param integrationId - The user ID for namespace segregation in Pinecone.
 * @param url - The URL of the webpage to load documents from.
 * @param maxDepth - The maximum depth for recursive loading (optional).
 * @param excludeDirs - Directories to exclude during recursive loading (optional).
 * @returns The vector store populated with document chunks.
 */
export const LoadDocs = async (integrationId: string, url: string, maxDepth?: number, excludeDirs?: string[]) => {
  const loadDocumentsFromWebPage = async (url: string) => {
    try {
      if (maxDepth !== undefined) {
        const compiledConvert = compile({ wordwrap: 130 });
        const loader = new RecursiveUrlLoader(url, {
          extractor: compiledConvert,
          maxDepth: maxDepth,
          // TODO: NEED to fix this issue that comes from the excludeDirs
          // excludeDirs: excludeDirs,
        });
        return await loader.load();
      } else {
        const loader = new CheerioWebBaseLoader(url);
        return await loader.load();
      }
    } catch (error: any) {
      console.error('Document loading failed:', error);
      throw new Error(`Document loading failed: ${error.message}`);
    }
  };

  const splitDocuments = async (docs: any) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    return await textSplitter.splitDocuments(docs);
  };

  const getVectorStore = async (integrationId: string) => {
    return await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex, namespace: integrationId }
    );
  };

  const docs = await loadDocumentsFromWebPage(url);
  const splitDocs = await splitDocuments(docs);
  const vectorStore = await getVectorStore(integrationId);
  await vectorStore.addDocuments(splitDocs);
  return vectorStore;
};

// Prompt template for contextualizing a question based on chat history.
const contextualizeQSystemPrompt = `Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.`;

// Prompt template for question answering based on retrieved context.
const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.

{context}`;

const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
  ["system", contextualizeQSystemPrompt],
  new MessagesPlaceholder("history"),
  ["human", "{question}"],
]);

const qaPrompt = ChatPromptTemplate.fromMessages([
  ["system", qaSystemPrompt],
  new MessagesPlaceholder("history"),
  ["human", "{question}"],
]);

const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
const contextualizeQChain = contextualizeQPrompt
  .pipe(llm)
  .pipe(new StringOutputParser());

/**
 * Contextualize a question based on chat history.
 * @param input - The input object containing chat history and the question.
 * @returns The reformulated question or the original question if no history is present.
 */
const contextualizedQuestion = async (input: Record<string, unknown>) => {
  if ("history" in input && Array.isArray(input.history) && input.history.length > 0) {
    return await contextualizeQChain.invoke(input);
  }
  return input.question;
};

/**
 * Convert chat history messages to BaseMessages.
 * @param messages - Array of message objects from the database.
 * @returns Array of BaseMessage objects.
 */
const convertMessagesToBaseMessages = (messages: any[]) => {
  return messages.map(msg => {
    if (msg.role === 'user') {
      return new HumanMessage({ content: msg.content });
    } else {
      return new AIMessage({ content: msg.content });
    }
  });
};

/**
 * Process a query by retrieving relevant document chunks and generating an answer.
 * @param question - The user's question.
 * @param vectorStore - The vector store containing document chunks.
 * @param chatSessionId - The ID of the chat session.
 * @returns The generated response based on retrieved documents and chat history.
 */
export async function processQuery(question: string, vectorStore: any, chatSessionId: string): Promise<string> {
  const retriever = vectorStore.asRetriever();

  // Fetch chat history from PostgreSQL
  const chatHistory = await db.message.findMany({
    where: { chatSessionId },
    orderBy: { createdAt: 'asc' },
  });

  // Convert chat history to BaseMessages
  const baseMessages = convertMessagesToBaseMessages(chatHistory);

  const ragChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: async (input: Record<string, unknown>) => {
        if ("history" in input && Array.isArray(input.history) && input.history.length > 0) {
          const reformulatedQuestion = await contextualizedQuestion(input);
          const retrievedDocs = await retriever.invoke(reformulatedQuestion);
          return formatDocumentsAsString(retrievedDocs);
        }
        return "";
      },
    }),
    qaPrompt,
    llm,
  ]);

  const response = await ragChain.invoke({ question, history: baseMessages });

  if (response instanceof AIMessage) {
    return JSON.stringify(response.content);
  } else {
    throw new Error('The response is not an AIMessage instance');
  }
}
