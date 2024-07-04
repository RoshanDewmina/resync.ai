import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const usageSchema = z.object({
  userId: z.string(),
  tokensRemaining: z.number().int(),
  resetDate: z.date(),
})

export interface CompleteUsage extends z.infer<typeof usageSchema> {
  user: CompleteUser
}

/**
 * relatedUsageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUsageSchema: z.ZodSchema<CompleteUsage> = z.lazy(() => usageSchema.extend({
  user: relatedUserSchema,
}))
