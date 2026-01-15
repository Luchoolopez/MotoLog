"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanService = void 0;
const maintenance_plan_model_1 = require("../models/maintenance_plan.model");
const items_plan_model_1 = require("../models/items_plan.model");
class PlanService {
    async createPlan(data) {
        try {
            const newPlan = await maintenance_plan_model_1.MaintenancePlan.create(data);
            return newPlan;
        }
        catch (error) {
            throw new Error('Error al crear el plan de mantenimiento: ' + error);
        }
    }
    async getAll() {
        return await maintenance_plan_model_1.MaintenancePlan.findAll();
    }
    async getPlanById(id) {
        const plan = await maintenance_plan_model_1.MaintenancePlan.findByPk(id, {
            include: [
                { model: items_plan_model_1.ItemsPlan, as: 'items' }
            ]
        });
        if (!plan) {
            throw new Error('Plan de mantenimiento no encontrado');
        }
        return plan;
    }
    async updatePlan(id, data) {
        const plan = await this.getPlanById(id);
        await plan.update(data);
        return plan;
    }
    async deletePlan(id) {
        const plan = await this.getPlanById(id);
        await plan.destroy();
        return { message: 'Plan eliminado correctamente' };
    }
}
exports.PlanService = PlanService;
