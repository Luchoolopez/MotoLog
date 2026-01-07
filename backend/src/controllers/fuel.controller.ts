import { Request, Response } from "express";
import { FuelService } from "../services/fuel.service";

export class FuelController {
    private service: FuelService;

    constructor() {
        this.service = new FuelService();
    }

    create = async (req: Request, res: Response) => {
        try {
            const record = await this.service.create(req.body);
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

    getHistoryByMotoId = async (req: Request, res: Response) => {
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
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener historial de combustible',
                error: error.message
            });
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const record = await this.service.update(Number(id), req.body);
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

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.service.delete(Number(id));
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
