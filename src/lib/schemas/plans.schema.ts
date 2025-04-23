import { z } from 'zod';

export const plansQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  guide_id: z.string().uuid().optional(),
  is_favorite: z.coerce.boolean().optional()
});

export type PlansQuerySchemaType = z.infer<typeof plansQuerySchema>;

export const createPlanCommandSchema = z.object({
  name: z.string().min(1, 'Nazwa planu jest wymagana'),
  guide_id: z.string().uuid('Nieprawidłowy identyfikator przewodnika'),
  content: z.any(), // wymagane
  generation_params: z.any(), // wymagane
  is_favorite: z.boolean().optional().default(false)
});

export type CreatePlanCommandSchemaType = z.infer<typeof createPlanCommandSchema>; 