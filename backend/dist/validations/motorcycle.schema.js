"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMotorcycleSchema = exports.createMotorcycleSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createMotorcycleSchema = zod_1.default.object({
    marca: zod_1.default.string().min(1, { message: 'El nombre de la marca es muy corto' }),
    modelo: zod_1.default.string().min(1, { message: 'El modelo es obligatorio' }),
    anio: zod_1.default.number().int().positive({ message: 'El anio debe ser positivo' }),
    patente: zod_1.default.string().min(1, { message: 'La patente es muy corta' }),
    km_actual: zod_1.default.number().int().nonnegative().optional(),
    fecha_compra: zod_1.default.coerce.date({
        message: 'Formato de fecha invalido (YYYY-MM-DD)'
    }).max(new Date(), { message: 'La fecha de compra no puede ser futura' }),
    plan_id: zod_1.default.number().int().positive().optional()
});
exports.updateMotorcycleSchema = exports.createMotorcycleSchema.partial();
