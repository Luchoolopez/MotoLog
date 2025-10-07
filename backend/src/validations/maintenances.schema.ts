import { z } from "zod";

export const maintenanceCreateSchema = z.object({
  item: z.string().min(1).max(150),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const maintenanceUpdateSchema = maintenanceCreateSchema.partial();

export type MaintenanceCreate = z.infer<typeof maintenanceCreateSchema>;
export type MaintenanceUpdate = z.infer<typeof maintenanceUpdateSchema>;

export default maintenanceCreateSchema;
