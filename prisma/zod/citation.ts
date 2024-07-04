import * as z from "zod"
import { CitationType } from "@prisma/client"
import { CompleteMessage, relatedMessageSchema } from "./index"

export const citationSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  number: z.number().int(),
  type: z.nativeEnum(CitationType),
  url: z.string().nullish(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  breadcrumbs: z.string().array(),
  hitUrl: z.string().nullish(),
})

export interface CompleteCitation extends z.infer<typeof citationSchema> {
  message: CompleteMessage
}

/**
 * relatedCitationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCitationSchema: z.ZodSchema<CompleteCitation> = z.lazy(() => citationSchema.extend({
  message: relatedMessageSchema,
}))
