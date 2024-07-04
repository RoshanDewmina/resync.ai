import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const feedbackSchema = z.object({
  id: z.string(),
  userId: z.string(),
  rating: z.number().int(),
  message: z.string(),
  createdAt: z.date(),
})

export interface CompleteFeedback extends z.infer<typeof feedbackSchema> {
  user: CompleteUser
}

/**
 * relatedFeedbackSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedFeedbackSchema: z.ZodSchema<CompleteFeedback> = z.lazy(() => feedbackSchema.extend({
  user: relatedUserSchema,
}))
