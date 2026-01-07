import { MaintenanceHistory } from "../models/maintenance_history.model";
import { Motorcycle } from "../models/motorcycle.model";
import { ItemsPlan } from "../models/items_plan.model";
import { createMaintenanceHistoryType, updateMaintenanceHistoryType } from "../validations/maintenance_history.schema"; // Asumiendo que existe el schema

export class MaintenanceHistoryService {

    async create(data: createMaintenanceHistoryType) {
        try {
            const newRecord = await MaintenanceHistory.create(data as any);

            // Smart Odometer Update: only update if new service mileage is greater than current moto mileage
            const moto = await Motorcycle.findByPk(data.moto_id);

            console.log('--- DEBUG SMART ODOMETER ---');
            console.log('Moto ID:', data.moto_id);
            console.log('New Service Km:', data.km_realizado, typeof data.km_realizado);
            console.log('Current Moto Km:', moto?.km_actual, typeof moto?.km_actual);

            if (moto && Number(data.km_realizado) > Number(moto.km_actual)) {
                console.log('UPDATING ODOMETER to', data.km_realizado);
                await moto.update({ km_actual: data.km_realizado });
            } else {
                console.log('SKIPPING ODOMETER UPDATE');
            }

            return newRecord;
        } catch (error) {
            throw new Error('Error al registrar el mantenimiento: ' + error);
        }
    }

    async getHistoryByMotoId(motoId: number) {
        return await MaintenanceHistory.findAll({
            where: { moto_id: motoId },
            include: [
                {
                    model: ItemsPlan,
                    as: 'detalle_tarea',
                    attributes: ['tarea', 'intervalo_km']
                }
            ],
            order: [['fecha_realizado', 'DESC']]
        });
    }

    async getById(id: number) {
        const record = await MaintenanceHistory.findByPk(id);
        if (!record) {
            throw new Error('Registro de historial no encontrado');
        }
        return record;
    }

    async update(id: number, data: updateMaintenanceHistoryType) {
        const record = await this.getById(id);
        await record.update(data as any);
        return record;
    }

    async delete(id: number) {
        const record = await this.getById(id);
        await record.destroy();
        return { message: 'Registro eliminado correctamente' };
    }
}