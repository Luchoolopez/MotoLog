import z from 'zod';

export const createMaintenanceHistorySchema = z.object({
    moto_id: z.number().int().positive({ message: 'Moto_ID invalido' }),
    item_plan_id: z.number().int().positive().nullable().optional(),
    tarea_ad_hoc: z.string().optional(),
    fecha_realizado: z.coerce.date({ message: 'La fecha es obligatoria' }).max(new Date(), { message: 'La fecha de realizado no puede ser futura' }),
    km_realizado: z.number().int().nonnegative({ message: 'El kilometraje realizado debe ser 0 o positivo' }),
    observaciones: z.string().optional(),
    consumed_items: z.array(z.object({
        warehouse_item_id: z.number(),
        cantidad_usada: z.number().positive().default(1)
    })).optional()
});

export const updateMaintenanceHistorySchema = createMaintenanceHistorySchema.partial();

export type createMaintenanceHistoryType = z.infer<typeof createMaintenanceHistorySchema>;
export type updateMaintenanceHistoryType = z.infer<typeof updateMaintenanceHistorySchema>;
