import * as z from "zod"
import { PlanType, BillingCycle } from "@prisma/client"
import { CompleteUser, relatedUserSchema } from "./index"

export const subscriptionSchema = z.object({
  userId: z.string(),
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string().nullish(),
  stripePriceId: z.string().nullish(),
  stripeCurrentPeriodEnd: z.date().nullish(),
  planType: z.nativeEnum(PlanType),
  billingCycle: z.nativeEnum(BillingCycle),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastTokenReset: z.date(),
})

export interface CompleteSubscription extends z.infer<typeof subscriptionSchema> {
  User: CompleteUser
}

/**
 * relatedSubscriptionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSubscriptionSchema: z.ZodSchema<CompleteSubscription> = z.lazy(() => subscriptionSchema.extend({
  User: relatedUserSchema,
}))
