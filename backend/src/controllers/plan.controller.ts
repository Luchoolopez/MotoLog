import { Request, Response } from "express";
import { PlanService } from "../services/plan.service";

export class PlanController {
    private planService: PlanService;
    constructor() {
        this.planService = new PlanService();
    }

    createPlan = async (req: Request, res: Response) => {
        try {
            const plan = await this.planService.createPlan(req.body);
            return res.status(201).json({
                success: true,
                message: 'Plan creado correctamente',
                data: plan
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de crear el plan',
                error: error.message
            })
        }
    }

    getAllPlans = async (req: Request, res: Response) => {
        try {
            const plans = await this.planService.getAll();
            if (!plans || plans.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Todavía no hay ningún plan creado',
                    data: []
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Planes encontrados',
                data: plans
            })
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de encontrar los planes',
                error: error.message
            })
        }
    }

    getPlanById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                })
            }
            const plan = await this.planService.getPlanById(Number(id));
            return res.status(200).json({
                success: true,
                message: 'Plan encontrado exitosamente',
                data: plan
            })
        } catch (error: any) {
            // CORREGIDO: .includes
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: 'Plan no encontrado' 
                })
            }
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de encontrar el plan',
                error: error.message
            })
        }
    }

    updatePlan = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                })
            }
            const updatedPlan = await this.planService.updatePlan(Number(id), req.body);
            return res.status(200).json({
                success: true,
                message: 'Plan actualizado correctamente', 
                data: updatedPlan
            })
        } catch (error: any) {
            // CORREGIDO: .includes
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: 'Plan no encontrado' 
                })
            }
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de actualizar el plan' 
            })
        }
    }

    deletePlan = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                })
            }
            const deletedPlan = await this.planService.deletePlan(Number(id));
            return res.status(200).json({
                success: true,
                message: 'Plan eliminado correctamente',
                data: deletedPlan
            })
        } catch (error: any) {
            // CORREGIDO: .includes
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: 'Plan no encontrado' 
                })
            }
            return res.status(500).json({
                success: false,
                message: 'Error a la hora de eliminar el plan', 
                error: error.message
            })
        }
    }
}