"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceCalculatorController = void 0;
const maintenanceCalculator_service_1 = require("../services/maintenanceCalculator.service");
class MaintenanceCalculatorController {
    constructor() {
        this.calculateStatus = async (req, res) => {
            try {
                const { id } = req.params;
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID no encontrado'
                    });
                }
                const result = await this.maintenanceCalculatorService.calculateStatus(Number(id));
                return res.status(200).json({
                    success: true,
                    message: 'Calculo realizado correctamente',
                    data: result
                });
            }
            catch (error) {
                if (error.message.includes('no encontrada')) {
                    return res.status(404).json({
                        success: false,
                        message: error.message
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: 'Error a la hora de hacer el calculo',
                    error: error.message
                });
            }
        };
        this.maintenanceCalculatorService = new maintenanceCalculator_service_1.MaintenanceCalculatorService();
    }
}
exports.MaintenanceCalculatorController = MaintenanceCalculatorController;
