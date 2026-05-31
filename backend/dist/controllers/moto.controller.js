"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotoController = void 0;
const moto_service_1 = require("../services/moto.service");
const motorcycle_schema_1 = require("../validations/motorcycle.schema");
class MotoController {
    constructor() {
        this.createMoto = async (req, res) => {
            try {
                const validatedData = motorcycle_schema_1.createMotorcycleSchema.parse(req.body);
                const motoData = { ...validatedData, user_id: req.user.id };
                const moto = await this.motoService.create(motoData);
                return res.status(201).json({
                    success: true,
                    message: 'Moto creado correctamente',
                    data: moto
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al crear la moto',
                    error: error.message
                });
            }
        };
        this.getAll = async (req, res) => {
            try {
                const AllMotos = await this.motoService.getAllByUser(req.user.id);
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
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error a la hora de encontrar las motos',
                    error: error.message
                });
            }
        };
        this.getMotoById = async (req, res) => {
            try {
                const { id } = req.params;
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID invalido'
                    });
                }
                const moto = await this.motoService.getMotoByIdAndUser(Number(id), req.user.id);
                return res.status(200).json({
                    success: true,
                    message: 'Moto encontrada',
                    data: moto
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error a la hora de encontrar la moto',
                    error: error.message
                });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID invalido'
                    });
                }
                const validatedData = motorcycle_schema_1.updateMotorcycleSchema.parse(req.body);
                await this.motoService.getMotoByIdAndUser(Number(id), req.user.id); // verify ownership
                const updated = await this.motoService.updateMoto(Number(id), validatedData);
                return res.status(200).json({
                    success: true,
                    message: 'Moto actualizada correctamente',
                    data: updated
                });
            }
            catch (error) {
                if (error.message.includes('no encontrado') || error.message.includes('pertenece') || error.message.includes('Formato') || error.message.includes('fecha') || error.message.includes('marca') || error.message.includes('modelo') || error.message.includes('anio') || error.message.includes('patente') || error.message.includes('km_actual') || error.message.includes('plan_id')) {
                    return res.status(400).json({
                        success: false,
                        message: 'Datos inválidos o moto no encontrado o no pertenece al usuario',
                        error: error.message
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: 'Error a la hora de actualizar la moto',
                    error: error.message
                });
            }
        };
        this.updateMileage = async (req, res) => {
            try {
                const { id } = req.params;
                const { newKm, date } = req.body;
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID invalido'
                    });
                }
                if (newKm === undefined || isNaN(Number(newKm))) {
                    return res.status(400).json({
                        success: false,
                        message: 'El nuevo kilometraje es requerido y debe ser un numero'
                    });
                }
                await this.motoService.getMotoByIdAndUser(Number(id), req.user.id); // verify ownership
                const updatedMileage = await this.motoService.updateMileage(Number(id), Number(newKm), date);
                return res.status(200).json({
                    success: true,
                    message: 'Kilometraje actualizado exitosamente',
                    data: updatedMileage
                });
            }
            catch (error) {
                if (error.message.includes('no encontrado') || error.message.includes('pertenece')) {
                    return res.status(404).json({
                        success: false,
                        message: 'Moto no encontrado o no pertenece al usuario'
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: 'Error a la hora de actualizar la moto',
                    error: error.message
                });
            }
        };
        this.deleteMoto = async (req, res) => {
            try {
                const { id } = req.params;
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID invalido'
                    });
                }
                await this.motoService.getMotoByIdAndUser(Number(id), req.user.id); // verify ownership
                const eliminated = await this.motoService.deleteMoto(Number(id));
                return res.status(200).json({
                    success: true,
                    message: 'Moto eliminado exitosamente',
                    data: eliminated
                });
            }
            catch (error) {
                if (error.message.includes('no encontrado') || error.message.includes('pertenece')) {
                    return res.status(404).json({
                        success: false,
                        message: 'Moto no encontrado o no pertenece al usuario'
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: 'Error a la hora de eliminar la moto',
                    error: error.message
                });
            }
        };
        this.motoService = new moto_service_1.MotoService();
    }
}
exports.MotoController = MotoController;
