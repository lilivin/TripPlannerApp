import { z } from "zod";

export const homeQuerySchema = z.object({
  language: z.string().min(2).max(10).optional(),
});

export type HomeQuerySchemaType = z.infer<typeof homeQuerySchema>;
