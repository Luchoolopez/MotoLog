"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelController = void 0;
const fuel_service_1 = require("../services/fuel.service");
class FuelController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const record = await this.service.create(req.body);
                return res.status(201).json({
                    success: true,
                    message: 'Registro de combustible creado',
                    data: record
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al crear registro de combustible',
                    error: error.message
                });
            }
        };
        this.getHistoryByMotoId = async (req, res) => {
            try {
                const { motoId } = req.params;
                const history = await this.service.getByMotoId(Number(motoId));
                const averageConsumption = await this.service.calculateAverageConsumption(Number(motoId));
                return res.status(200).json({
                    success: true,
                    data: {
                        history,
                        averageConsumption
                    }
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener historial de combustible',
                    error: error.message
                });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                const record = await this.service.update(Number(id), req.body);
                return res.status(200).json({
                    success: true,
                    message: 'Registro de combustible actualizado',
                    data: record
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar registro de combustible',
                    error: error.message
                });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                await this.service.delete(Number(id));
                return res.status(200).json({
                    success: true,
                    message: 'Registro de combustible eliminado'
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al eliminar registro de combustible',
                    error: error.message
                });
            }
        };
        this.service = new fuel_service_1.FuelService();
    }
}
exports.FuelController = FuelController;
