import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const tokenPurchaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  tokens: z.number().int(),
  amount: z.number(),
  createdAt: z.date(),
})

export interface CompleteTokenPurchase extends z.infer<typeof tokenPurchaseSchema> {
  user: CompleteUser
}

/**
 * relatedTokenPurchaseSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTokenPurchaseSchema: z.ZodSchema<CompleteTokenPurchase> = z.lazy(() => tokenPurchaseSchema.extend({
  user: relatedUserSchema,
}))
