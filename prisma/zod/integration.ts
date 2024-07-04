import * as z from "zod"
import { IntegrationType, PlanType } from "@prisma/client"
import { CompleteProject, relatedProjectSchema, CompleteChatSession, relatedChatSessionSchema } from "./index"

export const integrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  apiKey: z.string(),
  type: z.nativeEnum(IntegrationType),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  plan: z.nativeEnum(PlanType),
  monthlyUsage: z.number().int(),
})

export interface CompleteIntegration extends z.infer<typeof integrationSchema> {
  project: CompleteProject
  chatSessions: CompleteChatSession[]
}

/**
 * relatedIntegrationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedIntegrationSchema: z.ZodSchema<CompleteIntegration> = z.lazy(() => integrationSchema.extend({
  project: relatedProjectSchema,
  chatSessions: relatedChatSessionSchema.array(),
}))
