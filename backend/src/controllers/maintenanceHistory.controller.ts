import { Request, Response } from "express";
import { MaintenanceHistoryService } from "../services/maintenanceHistory.service";

export class MaintenanceHistoryController {
    private historyService: MaintenanceHistoryService;

    constructor() {
        this.historyService = new MaintenanceHistoryService();
    }

    createHistory = async (req: Request, res: Response) => {
        try {
            const record = await this.historyService.create(req.body);
            return res.status(201).json({
                success: true,
                message: 'Mantenimiento registrado correctamente',
                data: record
            });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Error al registrar el mantenimiento',
                error: error.message
            });
        }
    }

    getByMotoId = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ success: false, message: 'ID de moto inválido' });
            }

            const history = await this.historyService.getHistoryByMotoId(Number(id));
            
            return res.status(200).json({
                success: true,
                message: 'Historial obtenido correctamente',
                data: history
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el historial',
                error: error.message
            });
        }
    }

    updateHistory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params; 
            
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ success: false, message: 'ID de registro inválido' });
            }

            const updatedRecord = await this.historyService.update(Number(id), req.body);
            
            return res.status(200).json({
                success: true,
                message: 'Registro actualizado correctamente',
                data: updatedRecord
            });

        } catch (error: any) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: 'Registro no encontrado' });
            }
            return res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
        }
    }

    deleteHistory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ success: false, message: 'ID inválido' });
            }

            const result = await this.historyService.delete(Number(id));
            
            return res.status(200).json({
                success: true,
                message: 'Registro eliminado',
                data: result
            });

        } catch (error: any) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: 'Registro no encontrado' });
            }
            return res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
        }
    }
}