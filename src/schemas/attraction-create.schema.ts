import { z } from "zod";

export const createAttractionSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana").max(255),
  description: z.string().min(1, "Opis jest wymagany"),
  address: z.string().min(1, "Adres jest wymagany"),
  geolocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  opening_hours: z.record(z.any()).optional().nullable(),
  contact_info: z.record(z.any()).optional().nullable(),
  images: z.array(z.string().url()).min(1, "Wymagane jest co najmniej jedno zdjęcie"),
  average_visit_time_minutes: z.number().int().positive().optional().nullable(),
  ticket_price_info: z.string().optional().nullable(),
  accessibility_info: z.string().optional().nullable(),
});
