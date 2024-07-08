
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough, RunnableMap, RunnableLike } from "@langchain/core/runnables";
import { AIMessage, AIMessageChunk, HumanMessage } from "@langchain/core/messages";
import { formatDocumentsAsString } from "langchain/util/document";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { compile } from "html-to-text";
import { db } from '@/lib/db'; // Import your database client
import { ChatPromptValueInterface } from "node_modules/@langchain/core/dist/prompt_values";

const pc = new Pinecone();
const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

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
      new OpenAIEmbeddings({
        model: "text-embedding-3-large",
      }),
      { pineconeIndex, namespace: integrationId }
    );
  };

  const docs = await loadDocumentsFromWebPage(url);
  const splitDocs = await splitDocuments(docs);
  const vectorStore = await getVectorStore(integrationId);
  await vectorStore.addDocuments(splitDocs);
  return vectorStore;
};

const contextualizeQSystemPrompt = `Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.`;

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

const convertMessagesToBaseMessages = (messages: any[]) => {
  return messages.map(msg => {
    if (msg.role === 'user') {
      return new HumanMessage({ content: msg.content });
    } else {
      return new AIMessage({ content: msg.content });
    }
  });
};

export async function processQuery(question: string, vectorStore: any, chatSessionId: string, chat_mode?: string): Promise<string> {
  const retriever = vectorStore.asRetriever();

  const model = chat_mode === 'ADVANCED' ? "gpt-4" : "gpt-3.5-turbo";
  const llm = new ChatOpenAI({ model, temperature: 0 });

  const contextualizeQChain = contextualizeQPrompt
    .pipe(llm as RunnableLike<ChatPromptValueInterface, AIMessageChunk>)
    .pipe(new StringOutputParser());

  const chatHistory = await db.message.findMany({
    where: { chatSessionId },
    orderBy: { createdAt: 'asc' },
  });

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
    llm as RunnableLike<any, AIMessageChunk>, // Explicitly cast llm to RunnableLike<any, AIMessageChunk>
  ]);

  const contextualizedQuestion = async (input: Record<string, unknown>) => {
    if ("history" in input && Array.isArray(input.history) && input.history.length > 0) {
      return await contextualizeQChain.invoke(input);
    }
    return input.question;
  };

  let output = "";

  for await (const chunk of await ragChain.stream({ question, history: baseMessages })) {
    if (chunk.content) {
      output += chunk.content;
    }
  }

  return output;
}

