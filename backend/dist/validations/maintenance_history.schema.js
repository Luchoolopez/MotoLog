"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaintenanceHistorySchema = exports.createMaintenanceHistorySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createMaintenanceHistorySchema = zod_1.default.object({
    moto_id: zod_1.default.number().int().positive({ message: 'Moto_ID invalido' }),
    item_plan_id: zod_1.default.number().int().positive().nullable().optional(),
    tarea_ad_hoc: zod_1.default.string().optional(),
    fecha_realizado: zod_1.default.coerce.date({ message: 'La fecha es obligatoria' }).max(new Date(), { message: 'La fecha de realizado no puede ser futura' }),
    km_realizado: zod_1.default.number().int().nonnegative({ message: 'El kilometraje realizado debe ser 0 o positivo' }),
    observaciones: zod_1.default.string().optional(),
    consumed_items: zod_1.default.array(zod_1.default.object({
        warehouse_item_id: zod_1.default.number(),
        cantidad_usada: zod_1.default.number().positive().default(1)
    })).optional()
});
exports.updateMaintenanceHistorySchema = exports.createMaintenanceHistorySchema.partial();
