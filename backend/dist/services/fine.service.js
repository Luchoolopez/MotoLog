"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FineService = void 0;
const fine_model_1 = require("../models/fine.model");
class FineService {
    static async create(data) {
        return await fine_model_1.Fine.create(data);
    }
    static async getAllByMotoId(motoId) {
        return await fine_model_1.Fine.findAll({
            where: { moto_id: motoId },
            order: [['date', 'DESC']]
        });
    }
    static async update(id, data) {
        const item = await fine_model_1.Fine.findByPk(id);
        if (!item)
            throw new Error('Registro no encontrado');
        return await item.update(data);
    }
    static async delete(id) {
        const item = await fine_model_1.Fine.findByPk(id);
        if (!item)
            throw new Error('Registro no encontrado');
        return await item.destroy();
    }
}
exports.FineService = FineService;
