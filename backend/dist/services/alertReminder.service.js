"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertReminderService = void 0;
const sequelize_1 = require("sequelize");
const alert_reminder_model_1 = require("../models/alert_reminder.model");
class AlertReminderService {
    async getActiveByUser(userId) {
        const now = new Date();
        await alert_reminder_model_1.AlertReminder.destroy({
            where: {
                user_id: userId,
                snoozed_until: { [sequelize_1.Op.lte]: now }
            }
        });
        return await alert_reminder_model_1.AlertReminder.findAll({
            where: {
                user_id: userId,
                snoozed_until: { [sequelize_1.Op.gt]: now }
            },
            order: [['snoozed_until', 'ASC']]
        });
    }
    async snooze(userId, alertKey, snoozedUntil) {
        const [record] = await alert_reminder_model_1.AlertReminder.upsert({
            user_id: userId,
            alert_key: alertKey,
            snoozed_until: snoozedUntil
        });
        return record;
    }
    async clear(userId, alertKey) {
        const where = alertKey ? { user_id: userId, alert_key: alertKey } : { user_id: userId };
        await alert_reminder_model_1.AlertReminder.destroy({ where });
        return { message: 'Recordatorios restaurados' };
    }
}
exports.AlertReminderService = AlertReminderService;
