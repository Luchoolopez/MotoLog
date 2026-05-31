import { OdometerHistory } from "../models/odometer_history.model";
import { Motorcycle } from "../models/motorcycle.model";

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

    async getByMotoId(motoId: number, userId: number) {
        const moto = await Motorcycle.findOne({ where: { id: motoId, user_id: userId } });
        if (!moto) throw new Error('Moto no encontrada o no pertenece al usuario');

        return await OdometerHistory.findAll({
            where: { moto_id: motoId },
            order: [['fecha', 'DESC']]
        });
    }
}
