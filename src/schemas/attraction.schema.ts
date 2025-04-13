import { z } from 'zod';

export const attractionsQuerySchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().max(100).optional().default(10),
  creator_id: z.string().uuid().optional(),
  search: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().optional().default(1000),
}).refine(data => {
  if ((data.latitude !== undefined && data.longitude === undefined) || 
      (data.latitude === undefined && data.longitude !== undefined)) {
    return false;
  }
  return true;
}, {
  message: "Parametry latitude i longitude muszą być podane razem"
});

export const attractionIdSchema = z.string().uuid({
  message: "Nieprawidłowy format ID atrakcji. Oczekiwano UUID."
}); 