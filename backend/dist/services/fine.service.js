"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FineService = void 0;
const fine_model_1 = require("../models/fine.model");
const motorcycle_model_1 = require("../models/motorcycle.model");
class FineService {
    static async create(data, userId) {
        await this.ensureMotoBelongsToUser(Number(data.moto_id), userId);
        return await fine_model_1.Fine.create(data);
    }
    static async getAllByMotoId(motoId, userId) {
        await this.ensureMotoBelongsToUser(motoId, userId);
        return await fine_model_1.Fine.findAll({
            where: { moto_id: motoId },
            order: [['date', 'DESC']]
        });
    }
    static async update(id, data, userId) {
        const item = await this.getRecordForUser(id, userId);
        if (!item)
            throw new Error('Registro no encontrado');
        return await item.update(data);
    }
    static async delete(id, userId) {
        const item = await this.getRecordForUser(id, userId);
        if (!item)
            throw new Error('Registro no encontrado');
        return await item.destroy();
    }
    static async ensureMotoBelongsToUser(motoId, userId) {
        const moto = await motorcycle_model_1.Motorcycle.findOne({ where: { id: motoId, user_id: userId } });
        if (!moto)
            throw new Error('Moto no encontrada o no pertenece al usuario');
        return moto;
    }
    static async getRecordForUser(id, userId) {
        return await fine_model_1.Fine.findOne({
            where: { id },
            include: [{
                    model: motorcycle_model_1.Motorcycle,
                    as: 'moto',
                    where: { user_id: userId },
                    attributes: ['id']
                }]
        });
    }
}
exports.FineService = FineService;
