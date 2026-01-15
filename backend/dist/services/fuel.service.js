"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelService = void 0;
const fuel_record_model_1 = require("../models/fuel_record.model");
class FuelService {
    async create(data) {
        try {
            // Autocalculate total if not provided
            if (!data.total) {
                data.total = data.litros * data.precio_por_litro;
            }
            return await fuel_record_model_1.FuelRecord.create(data);
        }
        catch (error) {
            throw new Error('Error al crear registro de combustible: ' + error);
        }
    }
    async update(id, data) {
        try {
            const record = await fuel_record_model_1.FuelRecord.findByPk(id);
            if (!record)
                throw new Error('Registro no encontrado');
            if (!data.total && data.litros && data.precio_por_litro) {
                data.total = data.litros * data.precio_por_litro;
            }
            return await record.update(data);
        }
        catch (error) {
            throw new Error('Error al actualizar registro de combustible: ' + error);
        }
    }
    async delete(id) {
        try {
            const record = await fuel_record_model_1.FuelRecord.findByPk(id);
            if (!record)
                throw new Error('Registro no encontrado');
            return await record.destroy();
        }
        catch (error) {
            throw new Error('Error al eliminar registro de combustible: ' + error);
        }
    }
    async getByMotoId(motoId) {
        return await fuel_record_model_1.FuelRecord.findAll({
            where: { moto_id: motoId },
            order: [['fecha', 'DESC']]
        });
    }
    async calculateAverageConsumption(motoId) {
        const records = await fuel_record_model_1.FuelRecord.findAll({
            where: { moto_id: motoId },
            order: [['km_momento', 'ASC']]
        });
        if (records.length < 2) {
            return { kmPerLiter: 0, litersPerKm: 0, litersPer100Km: 0 };
        }
        const firstRecord = records[0];
        const lastRecord = records[records.length - 1];
        const totalKm = lastRecord.km_momento - firstRecord.km_momento;
        if (totalKm <= 0)
            return { kmPerLiter: 0, litersPerKm: 0, litersPer100Km: 0 };
        let totalLitros = 0;
        // Sumamos todos los litros excepto el de la primera carga.
        // La primera carga se considera el punto de partida (tanque lleno inicial),
        // y las cargas subsiguientes son el combustible consumido para recorrer los KM.
        for (let i = 1; i < records.length; i++) {
            totalLitros += records[i].litros;
        }
        if (totalLitros === 0)
            return { kmPerLiter: 0, litersPerKm: 0, litersPer100Km: 0 };
        const kmPerLiter = totalKm / totalLitros;
        const litersPerKm = totalLitros / totalKm;
        const litersPer100Km = litersPerKm * 100;
        return {
            kmPerLiter,
            litersPerKm,
            litersPer100Km
        };
    }
}
exports.FuelService = FuelService;
