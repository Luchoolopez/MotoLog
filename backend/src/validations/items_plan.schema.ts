import z from "zod";

export const createItemsPlanSchema = z.object({
    plan_id: z.number().int().positive(),
    tarea: z.string().min(1),
    tipo: z.enum(['Inspección', 'Cambio', 'Limpieza', 'Lubricación', 'Ajuste']).optional().default('Inspección'),
    intervalo_km: z.number().int().nonnegative(),
    intervalo_meses: z.number().int().nonnegative(),
    consumo_sistematico: z.boolean().optional().default(false),
    associated_items: z.array(z.object({
        warehouse_item_id: z.number(),
        cantidad_sugerida: z.number().positive().default(1)
    })).optional()
});

export const updateItemsPlanSchema = createItemsPlanSchema.partial();

export type createItemsPlanType = z.infer<typeof createItemsPlanSchema>;
export type updateItemsPlanType = z.infer<typeof updateItemsPlanSchema>;

