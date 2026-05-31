import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { AlertReminderService } from "../services/alertReminder.service";

export class AlertReminderController {
    private service: AlertReminderService;

    constructor() {
        this.service = new AlertReminderService();
    }

    getActive = async (req: AuthRequest, res: Response) => {
        try {
            const reminders = await this.service.getActiveByUser(req.user!.id);
            return res.status(200).json({ success: true, data: reminders });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    snooze = async (req: AuthRequest, res: Response) => {
        try {
            const { alert_key, snoozed_until } = req.body;

            if (!alert_key || !snoozed_until) {
                return res.status(400).json({
                    success: false,
                    message: 'alert_key y snoozed_until son requeridos'
                });
            }

            const date = new Date(snoozed_until);
            if (Number.isNaN(date.getTime())) {
                return res.status(400).json({ success: false, message: 'Fecha invalida' });
            }

            const reminder = await this.service.snooze(req.user!.id, String(alert_key), date);
            return res.status(200).json({ success: true, data: reminder });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    clear = async (req: AuthRequest, res: Response) => {
        try {
            const { alertKey } = req.params;
            const result = await this.service.clear(req.user!.id, alertKey);
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}
