import { z } from 'zod';

export const guidesQuerySchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().max(100).optional().default(10),
  creator_id: z.string().uuid().optional(),
  language: z.string().optional(),
  location: z.string().optional(),
  min_days: z.coerce.number().positive().optional(),
  max_days: z.coerce.number().positive().optional(),
  is_published: z.coerce.boolean().optional().default(true),
  search: z.string().optional(),
}).refine(data => {
  if (data.min_days !== undefined && data.max_days !== undefined && data.min_days > data.max_days) {
    return false;
  }
  return true;
}, {
  message: "min_days nie może być większa niż max_days"
});

export const guideIdSchema = z.string().uuid({
  message: "Nieprawidłowy format ID przewodnika. Oczekiwano UUID."
});

export const guideQuerySchema = z.object({
  include_attractions: z.coerce.boolean().optional().default(false)
}); 