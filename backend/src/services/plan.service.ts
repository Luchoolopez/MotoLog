import { MaintenancePlan } from "../models/maintenance_plan.model";
import { ItemsPlan } from "../models/items_plan.model"; 
import { createMaintenancePlanType, updateMaintenancePlanType } from "../validations/maintenance_plan.schema";

export class PlanService {
    
    async createPlan(data: createMaintenancePlanType) {
        try {
            const newPlan = await MaintenancePlan.create(data as any);
            return newPlan;
        } catch (error) {
            throw new Error('Error al crear el plan de mantenimiento: ' + error);
        }
    }

    async getAll() {
        return await MaintenancePlan.findAll();
    }

    async getPlanById(id: number) {
        const plan = await MaintenancePlan.findByPk(id, {
            include: [
                { model: ItemsPlan, as: 'items' } 
            ]
        });

        if (!plan) {
            throw new Error('Plan de mantenimiento no encontrado');
        }
        return plan;
    }

    async updatePlan(id: number, data: updateMaintenancePlanType) {
        const plan = await this.getPlanById(id);
        await plan.update(data as any);
        return plan;
    }

    async deletePlan(id: number) {
        const plan = await this.getPlanById(id);
        await plan.destroy();
        return { message: 'Plan eliminado correctamente' };
    }
}