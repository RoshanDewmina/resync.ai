import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const tokenUsageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  tokens: z.number().int(),
  reason: z.string(),
  createdAt: z.date(),
})

export interface CompleteTokenUsage extends z.infer<typeof tokenUsageSchema> {
  user: CompleteUser
}

/**
 * relatedTokenUsageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTokenUsageSchema: z.ZodSchema<CompleteTokenUsage> = z.lazy(() => tokenUsageSchema.extend({
  user: relatedUserSchema,
}))
