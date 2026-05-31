import { Fine } from '../models/fine.model';
import { Motorcycle } from '../models/motorcycle.model';

export class FineService {
    static async create(data: any, userId: number) {
        await this.ensureMotoBelongsToUser(Number(data.moto_id), userId);
        return await Fine.create(data);
    }

    static async getAllByMotoId(motoId: number, userId: number) {
        await this.ensureMotoBelongsToUser(motoId, userId);

        return await Fine.findAll({
            where: { moto_id: motoId },
            order: [['date', 'DESC']]
        });
    }

    static async update(id: number, data: any, userId: number) {
        const item = await this.getRecordForUser(id, userId);
        if (!item) throw new Error('Registro no encontrado');
        return await item.update(data);
    }

    static async delete(id: number, userId: number) {
        const item = await this.getRecordForUser(id, userId);
        if (!item) throw new Error('Registro no encontrado');
        return await item.destroy();
    }

    private static async ensureMotoBelongsToUser(motoId: number, userId: number) {
        const moto = await Motorcycle.findOne({ where: { id: motoId, user_id: userId } });
        if (!moto) throw new Error('Moto no encontrada o no pertenece al usuario');
        return moto;
    }

    private static async getRecordForUser(id: number, userId: number) {
        return await Fine.findOne({
            where: { id },
            include: [{
                model: Motorcycle,
                as: 'moto',
                where: { user_id: userId },
                attributes: ['id']
            }]
        });
    }
}
