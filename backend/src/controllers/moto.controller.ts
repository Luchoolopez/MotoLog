import { Request, Response } from "express";
import { MotoService } from "../services/moto.service";

export class motoController {
    private motoService: MotoService;

    constructor() {
        this.motoService = new MotoService();
    }

    createMoto = async (req: Request, res: Response) => {
        try {
            const moto = await this.motoService.create(req.body);
            return res.status(201).json({
                success: true,
                message: 'Moto creado correctamente',
                data: moto
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al crear la moto',
                error: error.message
            });
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const AllMotos = await this.motoService.getAll();
            if (!AllMotos || AllMotos.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Todavia no hay ninguna moto creada',
                    data: []
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Motos encontradas exitosamente',
                data: AllMotos
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de encontrar las motos',
                error: error.message
            });
        }
    }

    getMotoById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalido'
                })
            }
            const moto = await this.motoService.getMotoById(Number(id));
            if (!moto) {
                return res.status(404).json({
                    success: false,
                    message: 'Moto no encontrada'
                })
            }
            return res.status(200).json({
                success: true,
                message: 'Moto encontrada',
                data: moto
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de encontrar la moto',
                error: error.message
            })
        }
    }

    updateMileage = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { km_actual } = req.body;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalido'
                })
            }

            if (km_actual === undefined || isNaN(Number(km_actual))) {
                return res.status(400).json({
                    success: false,
                    message: 'El Km_actual es requerido y debe ser un numero'
                })
            }
            const updatedMoto = await this.motoService.updateMoto(Number(id), km_actual);
            return res.status(200).json({
                success: true,
                message: 'Kilometraje actualizado exitosamente',
                data: updatedMoto
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de actualizar la moto',
                error: error.message

            })
        }
    }

    deleteMoto = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalido'
                })
            }

            const eliminated = await this.motoService.deleteMoto(Number(id));
            return res.status(200).json({
                success: true,
                message: 'Moto eliminado exitosamente',
                data: eliminated
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de eliminar la moto',
                error: error.message

            })
        }
    }
}