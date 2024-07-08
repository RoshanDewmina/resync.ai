import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

const pc = new Pinecone();

// Initialize the Pinecone index
const pineconeIndex = pc.Index(process.env.PINECONE_INDEX!);

// Function to create a new vector store in Pinecone
export async function createVectorStore(splits: any, customerId: string) {
  // You might want to perform checks related to user storage here before creating the vector store.
  // For example, ensure the user's storage limits allow for this new data.

  // Create a PineconeStore with the specified namespace (customerId)
  return await PineconeStore.fromDocuments(splits, new OpenAIEmbeddings({"model":"text-embedding-ada-002"}), {
    pineconeIndex,
    namespace: customerId,
  });
}

// Function to retrieve an existing vector store from Pinecone
export async function getVectorStore(customerId: string) {
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({
      model: "text-embedding-3-large",
    }),
    { pineconeIndex, namespace: customerId }
  );
  return vectorStore;
}
