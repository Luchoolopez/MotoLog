import { Request, Response } from "express";
import { OdometerHistoryService } from "../services/odometerHistory.service";

export class OdometerHistoryController {
    private service: OdometerHistoryService;

    constructor() {
        this.service = new OdometerHistoryService();
    }

    getHistoryByMotoId = async (req: Request, res: Response) => {
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
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener historial de odómetro',
                error: error.message
            });
        }
    }
}
