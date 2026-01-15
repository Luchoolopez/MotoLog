"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotoService = void 0;
const motorcycle_model_1 = require("../models/motorcycle.model");
const maintenance_plan_model_1 = require("../models/maintenance_plan.model");
const items_plan_model_1 = require("../models/items_plan.model");
const odometer_history_model_1 = require("../models/odometer_history.model");
class MotoService {
    async create(data) {
        try {
            const newMoto = await motorcycle_model_1.Motorcycle.create(data);
            return newMoto;
        }
        catch (error) {
            throw new Error('Error al crear la moto: ' + error);
        }
    }
    async getAllByUser(userId) {
        return await motorcycle_model_1.Motorcycle.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: maintenance_plan_model_1.MaintenancePlan,
                    as: 'plan_mantenimiento',
                    include: [{ model: items_plan_model_1.ItemsPlan, as: 'items' }]
                }
            ]
        });
    }
    async getMotoById(id) {
        const moto = await motorcycle_model_1.Motorcycle.findByPk(id);
        if (!moto) {
            throw new Error('Moto no encontrada');
        }
        return moto;
    }
    async getMotoByIdAndUser(id, userId) {
        const moto = await motorcycle_model_1.Motorcycle.findOne({ where: { id, user_id: userId } });
        if (!moto) {
            throw new Error('Moto no encontrada o no pertenece al usuario');
        }
        return moto;
    }
    async updateMileage(id, newKm, date) {
        try {
            const moto = await this.getMotoById(id);
            if (newKm < 0) {
                throw new Error('El kilometraje no puede ser negativo');
            }
            // [LOGGING] Save verification history
            // We use the date from the frontend, or the current time if not provided.
            // If it's just a date (YYYY-MM-DD), we ensure it's treated as UTC midnight
            // to avoid shifted dates due to local timezone.
            let recordDate;
            if (date) {
                // If date is "YYYY-MM-DD", appending "T00:00:00Z" makes it UTC midnight
                recordDate = new Date(date.includes('T') ? date : `${date}T12:00:00Z`);
            }
            else {
                recordDate = new Date();
            }
            await odometer_history_model_1.OdometerHistory.create({
                moto_id: id,
                km: newKm,
                fecha: recordDate,
                observaciones: 'Actualización manual'
            });
            // Instead of just updating with the current entry, 
            // we find the record with the most recent date to set as km_actual.
            const latestRecord = await odometer_history_model_1.OdometerHistory.findOne({
                where: { moto_id: id },
                order: [['fecha', 'DESC'], ['id', 'DESC']]
            });
            if (latestRecord) {
                await moto.update({ km_actual: latestRecord.km });
            }
            return moto;
        }
        catch (error) {
            throw new Error('Error al actualizar kilometraje: ' + error);
        }
    }
    async updateMoto(id, data) {
        const moto = await this.getMotoById(id);
        await moto.update(data);
        return moto;
    }
    //capaz lo tenga q desactivar mejor mas q borrar 
    async deleteMoto(id) {
        const moto = await this.getMotoById(id);
        await moto.destroy();
        return { message: 'Moto eliminada correctamente' };
    }
}
exports.MotoService = MotoService;
