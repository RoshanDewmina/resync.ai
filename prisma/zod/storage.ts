import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const storageSchema = z.object({
  userId: z.string(),
  storageUsed: z.number().int(),
})

export interface CompleteStorage extends z.infer<typeof storageSchema> {
  user: CompleteUser
}

/**
 * relatedStorageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedStorageSchema: z.ZodSchema<CompleteStorage> = z.lazy(() => storageSchema.extend({
  user: relatedUserSchema,
}))
