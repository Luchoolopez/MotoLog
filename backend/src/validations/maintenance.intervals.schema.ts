import { z } from "zod";

export const maintenanceIntervalCreateSchema = z.object({
  maintenance_id: z.number().int().positive(),
  action: z.string().min(1).max(10),
  interval_km: z.number().int().nonnegative().nullable().optional(),
  interval_months: z.number().int().nonnegative().nullable().optional(),
  first_due_km: z.number().int().nonnegative().nullable().optional(),
  note: z.string().max(255).nullable().optional(),
});

export const maintenanceIntervalUpdateSchema = maintenanceIntervalCreateSchema.partial();

export type MaintenanceIntervalCreate = z.infer<typeof maintenanceIntervalCreateSchema>;
export type MaintenanceIntervalUpdate = z.infer<typeof maintenanceIntervalUpdateSchema>;

export default maintenanceIntervalCreateSchema;
