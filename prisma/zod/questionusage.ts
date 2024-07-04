import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const questionUsageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  questions: z.number().int(),
  month: z.number().int(),
  year: z.number().int(),
  createdAt: z.date(),
})

export interface CompleteQuestionUsage extends z.infer<typeof questionUsageSchema> {
  user: CompleteUser
}

/**
 * relatedQuestionUsageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedQuestionUsageSchema: z.ZodSchema<CompleteQuestionUsage> = z.lazy(() => questionUsageSchema.extend({
  user: relatedUserSchema,
}))
