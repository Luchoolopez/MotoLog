import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { FuelService } from "../services/fuel.service";

export class FuelController {
    private service: FuelService;

    constructor() {
        this.service = new FuelService();
    }

    create = async (req: AuthRequest, res: Response) => {
        try {
            const record = await this.service.create(req.body, req.user!.id);
            return res.status(201).json({
                success: true,
                message: 'Registro de combustible creado',
                data: record
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al crear registro de combustible',
                error: error.message
            });
        }
    }

    getHistoryByMotoId = async (req: AuthRequest, res: Response) => {
        try {
            const { motoId } = req.params;
            const history = await this.service.getByMotoId(Number(motoId), req.user!.id);
            const averageConsumption = await this.service.calculateAverageConsumption(Number(motoId), req.user!.id);

            return res.status(200).json({
                success: true,
                data: {
                    history,
                    averageConsumption
                }
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener historial de combustible',
                error: error.message
            });
        }
    }

    update = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const record = await this.service.update(Number(id), req.body, req.user!.id);
            return res.status(200).json({
                success: true,
                message: 'Registro de combustible actualizado',
                data: record
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar registro de combustible',
                error: error.message
            });
        }
    }

    delete = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            await this.service.delete(Number(id), req.user!.id);
            return res.status(200).json({
                success: true,
                message: 'Registro de combustible eliminado'
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar registro de combustible',
                error: error.message
            });
        }
    }
}
