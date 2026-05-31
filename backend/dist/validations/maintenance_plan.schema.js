"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaintenancePlanSchema = exports.createMaintenancePlanSchema = void 0;
const zod_1 = require("zod");
exports.createMaintenancePlanSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(3, { message: 'El nombre es muy corto' }),
    descripcion: zod_1.z.string().optional()
});
exports.updateMaintenancePlanSchema = exports.createMaintenancePlanSchema.partial();
