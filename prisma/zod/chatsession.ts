import * as z from "zod"
import { ChatMode } from "@prisma/client"
import { CompleteIntegration, relatedIntegrationSchema, CompleteMessage, relatedMessageSchema } from "./index"

export const chatSessionSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  integrationId: z.string(),
  guidance: z.string().nullish(),
  context: z.string().nullish(),
  tags: z.string().array(),
  chatMode: z.nativeEnum(ChatMode).nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteChatSession extends z.infer<typeof chatSessionSchema> {
  integration: CompleteIntegration
  messages: CompleteMessage[]
}

/**
 * relatedChatSessionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedChatSessionSchema: z.ZodSchema<CompleteChatSession> = z.lazy(() => chatSessionSchema.extend({
  integration: relatedIntegrationSchema,
  messages: relatedMessageSchema.array(),
}))
