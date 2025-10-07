import { z } from "zod";

export const motorcycleCreateSchema = z.object({
  name: z.string().min(1).max(120),
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().positive().optional(),
  current_km: z.number().int().nonnegative().optional(),
  created_at: z.preprocess((arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg), z.date()).optional(),
});

export const motorcycleUpdateSchema = motorcycleCreateSchema.partial();

export type MotorcycleCreate = z.infer<typeof motorcycleCreateSchema>;
export type MotorcycleUpdate = z.infer<typeof motorcycleUpdateSchema>;

export default motorcycleCreateSchema;
