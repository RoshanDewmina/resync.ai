import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteIntegration, relatedIntegrationSchema } from "./index"

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteProject extends z.infer<typeof projectSchema> {
  user: CompleteUser
  integrations: CompleteIntegration[]
}

/**
 * relatedProjectSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProjectSchema: z.ZodSchema<CompleteProject> = z.lazy(() => projectSchema.extend({
  user: relatedUserSchema,
  integrations: relatedIntegrationSchema.array(),
}))
