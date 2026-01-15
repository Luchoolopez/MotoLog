"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FineController = void 0;
const fine_service_1 = require("../services/fine.service");
class FineController {
    static async create(req, res) {
        try {
            console.log('[FineController] Creating fine:', req.body);
            const data = req.body;
            const record = await fine_service_1.FineService.create(data);
            res.json(record);
        }
        catch (error) {
            console.error('[FineController] Create ERROR:', error);
            res.status(500).json({ message: error.message || 'Error creating fine', error: error.toString() });
        }
    }
    static async getByMoto(req, res) {
        try {
            const { motoId } = req.params;
            console.log('[FineController] Getting fines for moto:', motoId);
            const records = await fine_service_1.FineService.getAllByMotoId(Number(motoId));
            res.json(records);
        }
        catch (error) {
            console.error('[FineController] GetByMoto ERROR:', error);
            res.status(500).json({ message: error.message || 'Error getting fines', error: error.toString() });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updated = await fine_service_1.FineService.update(Number(id), req.body);
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await fine_service_1.FineService.delete(Number(id));
            res.json({ message: 'Eliminado correctamente' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.FineController = FineController;
