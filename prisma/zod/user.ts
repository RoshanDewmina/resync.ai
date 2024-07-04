import * as z from "zod"
import { PlanType } from "@prisma/client"
import { CompleteProject, relatedProjectSchema, CompleteTokenUsage, relatedTokenUsageSchema, CompleteStorage, relatedStorageSchema, CompleteSubscription, relatedSubscriptionSchema, CompleteQuestionUsage, relatedQuestionUsageSchema, CompleteFeedback, relatedFeedbackSchema, CompleteErrorLog, relatedErrorLogSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  clerkUserId: z.string(),
  email: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  imageUrl: z.string().nullish(),
  plan: z.nativeEnum(PlanType),
  credits: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  projects: CompleteProject[]
  TokenUsage: CompleteTokenUsage[]
  Storage: CompleteStorage[]
  subscriptions: CompleteSubscription[]
  QuestionUsage: CompleteQuestionUsage[]
  Feedback: CompleteFeedback[]
  ErrorLog: CompleteErrorLog[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  projects: relatedProjectSchema.array(),
  TokenUsage: relatedTokenUsageSchema.array(),
  Storage: relatedStorageSchema.array(),
  subscriptions: relatedSubscriptionSchema.array(),
  QuestionUsage: relatedQuestionUsageSchema.array(),
  Feedback: relatedFeedbackSchema.array(),
  ErrorLog: relatedErrorLogSchema.array(),
}))
