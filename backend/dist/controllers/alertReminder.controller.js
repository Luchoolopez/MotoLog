"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertReminderController = void 0;
const alertReminder_service_1 = require("../services/alertReminder.service");
class AlertReminderController {
    constructor() {
        this.getActive = async (req, res) => {
            try {
                const reminders = await this.service.getActiveByUser(req.user.id);
                return res.status(200).json({ success: true, data: reminders });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        };
        this.snooze = async (req, res) => {
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
                const reminder = await this.service.snooze(req.user.id, String(alert_key), date);
                return res.status(200).json({ success: true, data: reminder });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        };
        this.clear = async (req, res) => {
            try {
                const { alertKey } = req.params;
                const result = await this.service.clear(req.user.id, alertKey);
                return res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        };
        this.service = new alertReminder_service_1.AlertReminderService();
    }
}
exports.AlertReminderController = AlertReminderController;
