import { z} from "zod";

export const createMaintenancePlanSchema = z.object({
    nombre:z.string().min(3, {message: 'El nombre es muy corto'}),
    descripcion: z.string().optional()
})

export const updateMaintenancePlanSchema = createMaintenancePlanSchema.partial();

export type createMaintenancePlanType = z.infer<typeof createMaintenancePlanSchema>;
export type updateMaintenancePlanType = z.infer<typeof updateMaintenancePlanSchema>;