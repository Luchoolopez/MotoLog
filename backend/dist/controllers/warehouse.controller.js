"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
const warehouse_service_1 = require("../services/warehouse.service");
class WarehouseController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const data = { ...req.body, user_id: req.user.id };
                const item = await this.service.create(data);
                return res.status(201).json({
                    success: true,
                    message: 'Item agregado al almacén correctamente',
                    data: item
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al agregar item al almacén',
                    error: error.message
                });
            }
        };
        this.getAll = async (req, res) => {
            try {
                const items = await this.service.getAllByUser(req.user.id);
                return res.status(200).json({
                    success: true,
                    data: items
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener items del almacén',
                    error: error.message
                });
            }
        };
        this.getById = async (req, res) => {
            try {
                const { id } = req.params;
                const item = await this.service.getById(Number(id), req.user.id);
                return res.status(200).json({
                    success: true,
                    data: item
                });
            }
            catch (error) {
                return res.status(404).json({
                    success: false,
                    message: 'Item no encontrado',
                    error: error.message
                });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                const updated = await this.service.update(Number(id), req.user.id, req.body);
                return res.status(200).json({
                    success: true,
                    message: 'Item actualizado correctamente',
                    data: updated
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al actualizar item del almacén',
                    error: error.message
                });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                await this.service.delete(Number(id), req.user.id);
                return res.status(200).json({
                    success: true,
                    message: 'Item eliminado del almacén correctamente'
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al eliminar item del almacén',
                    error: error.message
                });
            }
        };
        this.getHistory = async (req, res) => {
            try {
                const { id } = req.params;
                const { global } = req.query;
                const isGlobal = global === 'true';
                const history = await this.service.getItemUsageHistory(Number(id), req.user.id, isGlobal);
                return res.status(200).json({
                    success: true,
                    data: history
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener historial de uso',
                    error: error.message
                });
            }
        };
        this.service = new warehouse_service_1.WarehouseService();
    }
}
exports.WarehouseController = WarehouseController;
