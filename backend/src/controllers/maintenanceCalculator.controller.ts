import { Request, Response } from "express";
import { MaintenanceCalculatorService } from "../services/maintenanceCalculator.service";

export class MaintenanceCalculatorController {
    private maintenanceCalculatorService: MaintenanceCalculatorService;
    constructor() {
        this.maintenanceCalculatorService = new MaintenanceCalculatorService();
    }

    calculateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success:false,
                    message:'ID no encontrado'
                })
            }
            const result = await this.maintenanceCalculatorService.calculateStatus(Number(id));

            return res.status(200).json({
                success: true,
                message: 'Calculo realizado correctamente',
                data: result
            })
        } catch (error: any) {
            if (error.message.includes('no encontrada')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error a la hora de hacer el calculo',
                error: error.message
            })
        }
    }
}