import z from "zod";

export const createItemsPlanSchema = z.object({
    plan_id: z.number().int().positive({message:'El plan_ID es invalido'}),
    tarea:z.string().min(3, {message:'La tarea es muy corta'}),
    intervalo_km:z.number().positive({message:'El intevalo_km debe ser un numero positivo'}),
    intervalo_meses:z.number().int().positive({message:'El intervalo de meses debe ser un numero positivo'})
});

export const updateItemsPlanSchema = createItemsPlanSchema.partial();

export type createItemsPlanType = z.infer<typeof createItemsPlanSchema>;
export type updateItemsPlanType = z.infer<typeof updateItemsPlanSchema>;

