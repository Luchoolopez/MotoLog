import { Motorcycle, MotorcycleCreationAttributes } from "../models/motorcycle.model";
import { MaintenancePlan } from "../models/maintenance_plan.model";
import { ItemsPlan } from "../models/items_plan.model";
import { OdometerHistory } from "../models/odometer_history.model";
import { createMotorcycleType, updateMotorcycleType } from "../validations/motorcycle.schema";

export class MotoService {
    async create(data: createMotorcycleType) {
        try {
            const newMoto = await Motorcycle.create(data as MotorcycleCreationAttributes);
            return newMoto;
        } catch (error) {
            throw new Error('Error al crear la moto: ' + error);
        }
    }

    async getAllByUser(userId: number) {
        return await Motorcycle.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: MaintenancePlan,
                    as: 'plan_mantenimiento',
                    include: [{ model: ItemsPlan, as: 'items' }]
                }
            ]
        });
    }

    async getMotoById(id: number) {
        const moto = await Motorcycle.findByPk(id);
        if (!moto) {
            throw new Error('Moto no encontrada');
        }
        return moto;
    }

    async getMotoByIdAndUser(id: number, userId: number) {
        const moto = await Motorcycle.findOne({ where: { id, user_id: userId } });
        if (!moto) {
            throw new Error('Moto no encontrada o no pertenece al usuario');
        }
        return moto;
    }

    async updateMileage(id: number, newKm: number, date?: string) {
        try {
            const moto = await this.getMotoById(id);

            if (newKm < 0) {
                throw new Error('El kilometraje no puede ser negativo');
            }

            // [LOGGING] Save verification history
            // We use the date from the frontend, or the current time if not provided.
            // If it's just a date (YYYY-MM-DD), we ensure it's treated as UTC midnight
            // to avoid shifted dates due to local timezone.
            let recordDate: Date;
            if (date) {
                // If date is "YYYY-MM-DD", appending "T00:00:00Z" makes it UTC midnight
                recordDate = new Date(date.includes('T') ? date : `${date}T12:00:00Z`);
            } else {
                recordDate = new Date();
            }

            await OdometerHistory.create({
                moto_id: id,
                km: newKm,
                fecha: recordDate,
                observaciones: 'Actualización manual'
            });

            // Instead of just updating with the current entry, 
            // we find the record with the most recent date to set as km_actual.
            const latestRecord = await OdometerHistory.findOne({
                where: { moto_id: id },
                order: [['fecha', 'DESC'], ['id', 'DESC']]
            });

            if (latestRecord) {
                await moto.update({ km_actual: latestRecord.km });
            }

            return moto;
        } catch (error) {
            throw new Error('Error al actualizar kilometraje: ' + error);
        }
    }

    async updateMoto(id: number, data: updateMotorcycleType) {
        const moto = await this.getMotoById(id);
        await moto.update(data as any);
        return moto;
    }

    //capaz lo tenga q desactivar mejor mas q borrar 
    async deleteMoto(id: number) {
        const moto = await this.getMotoById(id);
        await moto.destroy();
        return { message: 'Moto eliminada correctamente' };
    }
}