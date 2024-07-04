import * as z from "zod"
import { CompleteChatSession, relatedChatSessionSchema, CompleteCitation, relatedCitationSchema } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const messageSchema = z.object({
  id: z.string(),
  chatSessionId: z.string(),
  role: z.string(),
  content: z.string(),
  recordsCited: jsonSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteMessage extends z.infer<typeof messageSchema> {
  chatSession: CompleteChatSession
  Citation: CompleteCitation[]
}

/**
 * relatedMessageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMessageSchema: z.ZodSchema<CompleteMessage> = z.lazy(() => messageSchema.extend({
  chatSession: relatedChatSessionSchema,
  Citation: relatedCitationSchema.array(),
}))
