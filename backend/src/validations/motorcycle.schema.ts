import z, { date } from "zod";

export const createMotorcycleSchema = z.object({
    marca:z.string().min(1, {message: 'El nombre de la marca es muy corto'}),
    modelo:z.string().min(1, {message:'El modelo es obligatorio'}),
    anio:z.number().int().positive({message: 'El anio debe ser positivo'}),
    patente:z.string().min(1, {message: 'La patente es muy corta'}),
    km_actual:z.number().int().nonnegative().optional(),
    fecha_compra:z.coerce.date({
        message:'Formato de fecha invalido (YYYY-MM-DD)'
    }).max(new Date(), {message: 'La fecha de compra no puede ser futura'}),
    plan_id:z.number().int().positive().optional()
});

export const updateMotorcycleSchema = createMotorcycleSchema.partial();

export type createMotorcycleType = z.infer<typeof createMotorcycleSchema>;
export type updateMotorcycleType = z.infer<typeof updateMotorcycleSchema>;
