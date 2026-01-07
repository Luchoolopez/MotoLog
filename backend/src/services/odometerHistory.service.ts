import { OdometerHistory } from "../models/odometer_history.model";

export class OdometerHistoryService {

    async create(data: { moto_id: number, km: number, fecha?: Date, observaciones?: string }) {
        try {
            return await OdometerHistory.create({
                ...data,
                fecha: data.fecha || new Date()
            });
        } catch (error) {
            throw new Error('Error guardando historial de odómetro: ' + error);
        }
    }

    async getByMotoId(motoId: number) {
        return await OdometerHistory.findAll({
            where: { moto_id: motoId },
            order: [['fecha', 'DESC']]
        });
    }
}
