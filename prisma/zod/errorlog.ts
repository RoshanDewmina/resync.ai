import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const errorLogSchema = z.object({
  id: z.string(),
  userId: z.string().nullish(),
  error: z.string(),
  context: z.string().nullish(),
  timestamp: z.date(),
})

export interface CompleteErrorLog extends z.infer<typeof errorLogSchema> {
  user?: CompleteUser | null
}

/**
 * relatedErrorLogSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedErrorLogSchema: z.ZodSchema<CompleteErrorLog> = z.lazy(() => errorLogSchema.extend({
  user: relatedUserSchema.nullish(),
}))
