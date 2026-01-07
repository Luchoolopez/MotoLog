import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { WarehouseService } from "../services/warehouse.service";

export class WarehouseController {
    private service: WarehouseService;

    constructor() {
        this.service = new WarehouseService();
    }

    create = async (req: AuthRequest, res: Response) => {
        try {
            const data = { ...req.body, user_id: req.user!.id };
            const item = await this.service.create(data);
            return res.status(201).json({
                success: true,
                message: 'Item agregado al almacén correctamente',
                data: item
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al agregar item al almacén',
                error: error.message
            });
        }
    }

    getAll = async (req: AuthRequest, res: Response) => {
        try {
            const items = await this.service.getAllByUser(req.user!.id);
            return res.status(200).json({
                success: true,
                data: items
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener items del almacén',
                error: error.message
            });
        }
    }

    getById = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const item = await this.service.getById(Number(id), req.user!.id);
            return res.status(200).json({
                success: true,
                data: item
            });
        } catch (error: any) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado',
                error: error.message
            });
        }
    }

    update = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const updated = await this.service.update(Number(id), req.user!.id, req.body);
            return res.status(200).json({
                success: true,
                message: 'Item actualizado correctamente',
                data: updated
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: 'Error al actualizar item del almacén',
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
                message: 'Item eliminado del almacén correctamente'
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: 'Error al eliminar item del almacén',
                error: error.message
            });
        }
    }
}
