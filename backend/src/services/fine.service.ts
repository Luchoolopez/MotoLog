import { Fine } from '../models/fine.model';

export class FineService {
    static async create(data: any) {
        return await Fine.create(data);
    }

    static async getAllByMotoId(motoId: number) {
        return await Fine.findAll({
            where: { moto_id: motoId },
            order: [['date', 'DESC']]
        });
    }

    static async update(id: number, data: any) {
        const item = await Fine.findByPk(id);
        if (!item) throw new Error('Registro no encontrado');
        return await item.update(data);
    }

    static async delete(id: number) {
        const item = await Fine.findByPk(id);
        if (!item) throw new Error('Registro no encontrado');
        return await item.destroy();
    }
}
