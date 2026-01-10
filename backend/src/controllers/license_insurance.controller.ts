import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { LicenseInsurance } from "../models/license_insurance.model";
import { Motorcycle } from "../models/motorcycle.model";

export const LicenseInsuranceController = {
    getAll: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            // console.log(`[DEBUG] LicenseInsuranceController.getAll called for user: ${userId}`);

            // SANITY CHECK START

            const records = await LicenseInsurance.findAll({
                where: { user_id: userId },
                include: [{ model: Motorcycle, as: 'moto', attributes: ['marca', 'modelo', 'patente'] }],
                order: [['fecha_vencimiento', 'DESC']]
            });
            // console.log(`[DEBUG] LicenseInsuranceController.getAll records found: ${records.length}`);
            res.json({ success: true, data: records });

            // console.log('[DEBUG] Sanity check: returning empty list');
            // res.json({ success: true, data: [] });
            // SANITY CHECK END
        } catch (error: any) {
            console.error("Error in LicenseInsuranceController.getAll:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getByMoto: async (req: AuthRequest, res: Response) => {
        try {
            const { motoId } = req.params;
            const userId = req.user?.id;
            const records = await LicenseInsurance.findAll({
                where: { moto_id: motoId, user_id: userId },
                order: [['fecha_vencimiento', 'ASC']]
            });
            res.json({ success: true, data: records });
        } catch (error: any) {
            console.error("Error in LicenseInsuranceController.getByMoto:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    create: async (req: AuthRequest, res: Response) => {
        try {
            console.log('[DEBUG] Creating LicenseInsurance with body:', JSON.stringify(req.body, null, 2));
            const userId = req.user?.id;
            const record = await LicenseInsurance.create({
                ...req.body,
                user_id: userId
            });
            res.status(201).json({ success: true, data: record });
        } catch (error: any) {
            console.error("Error in LicenseInsuranceController.create:", error);
            console.error("Validation errors:", error.errors); // Log sequelize validation errors specifically
            res.status(400).json({ success: false, message: error.message, details: error.errors });
        }
    },

    update: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const record = await LicenseInsurance.findOne({ where: { id, user_id: userId } });

            if (!record) {
                return res.status(404).json({ success: false, message: "Registro no encontrado" });
            }

            await record.update(req.body);
            res.json({ success: true, data: record });
        } catch (error: any) {
            console.error("Error in LicenseInsuranceController.update:", error);
            res.status(400).json({ success: false, message: error.message });
        }
    },

    delete: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const record = await LicenseInsurance.findOne({ where: { id, user_id: userId } });

            if (!record) {
                return res.status(404).json({ success: false, message: "Registro no encontrado" });
            }

            await record.destroy();
            res.json({ success: true, message: "Registro eliminado" });
        } catch (error: any) {
            console.error("Error in LicenseInsuranceController.delete:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
