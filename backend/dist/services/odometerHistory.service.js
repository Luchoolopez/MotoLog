"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdometerHistoryService = void 0;
const odometer_history_model_1 = require("../models/odometer_history.model");
class OdometerHistoryService {
    async create(data) {
        try {
            return await odometer_history_model_1.OdometerHistory.create({
                ...data,
                fecha: data.fecha || new Date()
            });
        }
        catch (error) {
            throw new Error('Error guardando historial de odómetro: ' + error);
        }
    }
    async getByMotoId(motoId) {
        return await odometer_history_model_1.OdometerHistory.findAll({
            where: { moto_id: motoId },
            order: [['fecha', 'DESC']]
        });
    }
}
exports.OdometerHistoryService = OdometerHistoryService;
