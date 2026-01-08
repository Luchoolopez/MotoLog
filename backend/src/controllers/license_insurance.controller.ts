import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { LicenseInsurance } from "../models/license_insurance.model";
import { Motorcycle } from "../models/motorcycle.model";

export const LicenseInsuranceController = {
    getAll: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            const records = await LicenseInsurance.findAll({
                where: { user_id: userId },
                include: [{ model: Motorcycle, as: 'moto', attributes: ['marca', 'modelo', 'patente'] }],
                order: [['fecha_vencimiento', 'ASC']]
            });
            res.json(records);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
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
            res.json(records);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    create: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            const record = await LicenseInsurance.create({
                ...req.body,
                user_id: userId
            });
            res.status(201).json(record);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const record = await LicenseInsurance.findOne({ where: { id, user_id: userId } });

            if (!record) {
                return res.status(404).json({ message: "Registro no encontrado" });
            }

            await record.update(req.body);
            res.json(record);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const record = await LicenseInsurance.findOne({ where: { id, user_id: userId } });

            if (!record) {
                return res.status(404).json({ message: "Registro no encontrado" });
            }

            await record.destroy();
            res.json({ message: "Registro eliminado" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};
