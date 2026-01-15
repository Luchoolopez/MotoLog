"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdometerHistoryController = void 0;
const odometerHistory_service_1 = require("../services/odometerHistory.service");
class OdometerHistoryController {
    constructor() {
        this.getHistoryByMotoId = async (req, res) => {
            try {
                const { motoId } = req.params;
                if (!motoId || isNaN(Number(motoId))) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID de moto inválido'
                    });
                }
                const history = await this.service.getByMotoId(Number(motoId));
                return res.status(200).json({
                    success: true,
                    message: 'Historial de odómetro encontrado',
                    data: history
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener historial de odómetro',
                    error: error.message
                });
            }
        };
        this.service = new odometerHistory_service_1.OdometerHistoryService();
    }
}
exports.OdometerHistoryController = OdometerHistoryController;
