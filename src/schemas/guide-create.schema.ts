import { z } from 'zod';

export const createGuideSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(10),
  language: z.string().length(2).default('pl').optional(),
  price: z.number().min(0).default(0).optional(),
  location_name: z.string().min(2).max(255),
  recommended_days: z.number().int().min(1).default(1).optional(),
  cover_image_url: z.string().url().nullable().optional(),
  is_published: z.boolean().default(false).optional()
}); 