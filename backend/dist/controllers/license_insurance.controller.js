"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseInsuranceController = void 0;
const license_insurance_model_1 = require("../models/license_insurance.model");
const motorcycle_model_1 = require("../models/motorcycle.model");
exports.LicenseInsuranceController = {
    getAll: async (req, res) => {
        try {
            const userId = req.user?.id;
            // console.log(`[DEBUG] LicenseInsuranceController.getAll called for user: ${userId}`);
            // SANITY CHECK START
            const records = await license_insurance_model_1.LicenseInsurance.findAll({
                where: { user_id: userId },
                include: [{ model: motorcycle_model_1.Motorcycle, as: 'moto', attributes: ['marca', 'modelo', 'patente'] }],
                order: [['fecha_vencimiento', 'DESC']]
            });
            // console.log(`[DEBUG] LicenseInsuranceController.getAll records found: ${records.length}`);
            res.json({ success: true, data: records });
            // console.log('[DEBUG] Sanity check: returning empty list');
            // res.json({ success: true, data: [] });
            // SANITY CHECK END
        }
        catch (error) {
            console.error("Error in LicenseInsuranceController.getAll:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getByMoto: async (req, res) => {
        try {
            const { motoId } = req.params;
            const userId = req.user?.id;
            const records = await license_insurance_model_1.LicenseInsurance.findAll({
                where: { moto_id: motoId, user_id: userId },
                order: [['fecha_vencimiento', 'ASC']]
            });
            res.json({ success: true, data: records });
        }
        catch (error) {
            console.error("Error in LicenseInsuranceController.getByMoto:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    create: async (req, res) => {
        try {
            console.log('[DEBUG] Creating LicenseInsurance with body:', JSON.stringify(req.body, null, 2));
            const userId = req.user?.id;
            const record = await license_insurance_model_1.LicenseInsurance.create({
                ...req.body,
                user_id: userId
            });
            res.status(201).json({ success: true, data: record });
        }
        catch (error) {
            console.error("Error in LicenseInsuranceController.create:", error);
            console.error("Validation errors:", error.errors); // Log sequelize validation errors specifically
            res.status(400).json({ success: false, message: error.message, details: error.errors });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const record = await license_insurance_model_1.LicenseInsurance.findOne({ where: { id, user_id: userId } });
            if (!record) {
                return res.status(404).json({ success: false, message: "Registro no encontrado" });
            }
            await record.update(req.body);
            res.json({ success: true, data: record });
        }
        catch (error) {
            console.error("Error in LicenseInsuranceController.update:", error);
            res.status(400).json({ success: false, message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const record = await license_insurance_model_1.LicenseInsurance.findOne({ where: { id, user_id: userId } });
            if (!record) {
                return res.status(404).json({ success: false, message: "Registro no encontrado" });
            }
            await record.destroy();
            res.json({ success: true, message: "Registro eliminado" });
        }
        catch (error) {
            console.error("Error in LicenseInsuranceController.delete:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
