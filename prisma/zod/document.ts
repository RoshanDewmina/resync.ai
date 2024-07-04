import * as z from "zod"
import { DocumentType } from "@prisma/client"

export const documentSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  url: z.string().nullish(),
  icon: z.string().nullish(),
  size: z.number().int().nullish(),
  uploadedDate: z.date(),
  integrationId: z.string(),
  hash: z.string().nullish(),
  maxDepth: z.number().int().nullish(),
  excludeDirs: z.string().array(),
  type: z.nativeEnum(DocumentType),
})
