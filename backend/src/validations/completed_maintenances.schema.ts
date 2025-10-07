import { z } from "zod";

export const completedMaintenanceCreateSchema = z.object({
  motorcycle_id: z.number().int().positive(),
  maintenance_interval_id: z.number().int().positive(),
  km_performed: z.number().int().nonnegative(),
  performed_at: z.preprocess((arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg), z.date()).optional(),
  notes: z.string().optional().nullable(),
});

export const completedMaintenanceUpdateSchema = completedMaintenanceCreateSchema.partial();

export type CompletedMaintenanceCreate = z.infer<typeof completedMaintenanceCreateSchema>;
export type CompletedMaintenanceUpdate = z.infer<typeof completedMaintenanceUpdateSchema>;

export default completedMaintenanceCreateSchema;
