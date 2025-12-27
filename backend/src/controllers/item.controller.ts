import { Request, Response } from "express";
import { ItemsService } from "../services/item.service";

export class ItemController {
    private itemService: ItemsService;

    constructor() {
        this.itemService = new ItemsService();
    }

    createItem = async (req: Request, res: Response) => {
        try {
            const newItem = await this.itemService.createItem(req.body);
            return res.status(201).json({
                success: true,
                message: 'Item creado exitosamente',
                data: newItem
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de crear el item',
                error: error.message
            })
        }
    }

    getAllItems = async (req: Request, res: Response) => {
        try {
            const items = await this.itemService.getAll();
            if (!items || items.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'No hay items creados todavia',
                    data: []
                })
            }
            return res.status(200).json({
                success: true,
                message: 'Items encontrados exitosamente',
                data: items
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de encontrar los items',
                error: error.message
            })
        }
    }

    getItemById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalido'
                })
            }
            const item = await this.itemService.getItemById(Number(id));
            return res.status(200).json({
                success: true,
                message: 'Item encontrado',
                data: item
            })
        } catch (error: any) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: 'Item no encontrado'
                })
            }
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de encontrar el item',
                error: error.message
            })
        }
    }

    updateItem = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalido'
                })
            }
            const updatedItem = await this.itemService.updateItem(Number(id), req.body);
            return res.status(200).json({
                success: true,
                message: 'Item actualizado correctamente',
                data: updatedItem
            })
        } catch (error: any) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: 'Item no encontrado'
                })
            }

            return res.status(500).json({
                success: false,
                messsage: 'Error a la hora de actualizar el Item',
                error: error.message
            })
        }
    }

    deleteItem = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalido'
                })
            }
            const eliminatedItem = await this.itemService.deleteItem(Number(id));
            return res.status(200).json({
                success: true,
                message: 'Item eliminado exitosamente',
                data: eliminatedItem
            })
        } catch (error: any) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: 'Item no encontrado'
                })
            }

            if (error.message.includes('No se puede eliminar')) {
                return res.status(409).json({ 
                    success: false, 
                    message: error.message 
                });
            }

            return res.status(500).json({
                success: false,
                messsage: 'Error a la hora de actualizar el item',
                error: error.message
            })
        }
    }

    getItemsByPlanId = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalido'
                })
            }

            const itemPlan = await this.itemService.getItemsByPlanId(Number(id));
            return res.status(200).json({
                success:true,
                message:'Item del plan encontrado exitosamente',
                data:itemPlan
            })
        } catch (error:any) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: 'Item no encontrado'
                })
            }

            return res.status(500).json({
                success:false,
                message:'Error a la hora de encontrar el item del plan',
                error:error.message
            })
        }
    }
}