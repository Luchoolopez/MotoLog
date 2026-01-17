import { Request, Response } from "express";
import { MaintenanceHistoryService } from "../services/maintenanceHistory.service";

export class MaintenanceHistoryController {
    private historyService: MaintenanceHistoryService;

    constructor() {
        this.historyService = new MaintenanceHistoryService();
    }

    createHistory = async (req: Request, res: Response) => {
        try {
            // Asegurar que valores numéricos lo sean
            const data = { ...req.body };
            if (data.km_realizado !== undefined) data.km_realizado = Number(data.km_realizado);
            if (data.moto_id !== undefined) data.moto_id = Number(data.moto_id);
            if (data.item_plan_id !== undefined && data.item_plan_id !== null) data.item_plan_id = Number(data.item_plan_id);

            // También limpiar items consumidos si existen
            if (data.consumed_items && Array.isArray(data.consumed_items)) {
                data.consumed_items = data.consumed_items.map((i: any) => ({
                    warehouse_item_id: Number(i.warehouse_item_id),
                    cantidad_usada: Number(i.cantidad_usada)
                }));
            }

            const record = await this.historyService.create(data);
            return res.status(201).json({
                success: true,
                message: 'Mantenimiento registrado correctamente',
                data: record
            });
        } catch (error: any) {
            console.error("Controller Error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Error al registrar el mantenimiento',
                error: error.name,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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