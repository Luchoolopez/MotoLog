import { Op } from "sequelize";
import { AlertReminder } from "../models/alert_reminder.model";

export class AlertReminderService {
    async getActiveByUser(userId: number) {
        const now = new Date();
        await AlertReminder.destroy({
            where: {
                user_id: userId,
                snoozed_until: { [Op.lte]: now }
            }
        });

        return await AlertReminder.findAll({
            where: {
                user_id: userId,
                snoozed_until: { [Op.gt]: now }
            },
            order: [['snoozed_until', 'ASC']]
        });
    }

    async snooze(userId: number, alertKey: string, snoozedUntil: Date) {
        const [record] = await AlertReminder.upsert({
            user_id: userId,
            alert_key: alertKey,
            snoozed_until: snoozedUntil
        });

        return record;
    }

    async clear(userId: number, alertKey?: string) {
        const where = alertKey ? { user_id: userId, alert_key: alertKey } : { user_id: userId };
        await AlertReminder.destroy({ where });
        return { message: 'Recordatorios restaurados' };
    }
}
