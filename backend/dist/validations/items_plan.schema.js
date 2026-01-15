"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemsPlanSchema = exports.createItemsPlanSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createItemsPlanSchema = zod_1.default.object({
    plan_id: zod_1.default.number().int().positive(),
    tarea: zod_1.default.string().min(1),
    tipo: zod_1.default.enum(['Inspección', 'Cambio', 'Limpieza', 'Lubricación', 'Ajuste']).optional().default('Inspección'),
    intervalo_km: zod_1.default.number().int().nonnegative(),
    intervalo_meses: zod_1.default.number().int().nonnegative(),
    consumo_sistematico: zod_1.default.boolean().optional().default(false),
    associated_items: zod_1.default.array(zod_1.default.object({
        warehouse_item_id: zod_1.default.number(),
        cantidad_sugerida: zod_1.default.number().positive().default(1)
    })).optional()
});
exports.updateItemsPlanSchema = exports.createItemsPlanSchema.partial();
