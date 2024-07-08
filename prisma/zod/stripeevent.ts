import * as z from "zod"

export const stripeEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  createdAt: z.date(),
})
