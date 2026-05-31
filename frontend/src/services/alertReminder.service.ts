import apiClient from '../types/apiClient';

export interface AlertReminder {
    id: number;
    user_id: number;
    alert_key: string;
    snoozed_until: string;
}

export const AlertReminderService = {
    getActive: async (): Promise<AlertReminder[]> => {
        const response = await apiClient.get('/alert-reminders');
        return response.data.data || [];
    },

    snooze: async (alertKey: string, snoozedUntil: string): Promise<AlertReminder> => {
        const response = await apiClient.post('/alert-reminders/snooze', {
            alert_key: alertKey,
            snoozed_until: snoozedUntil
        });
        return response.data.data;
    },

    clearAll: async (): Promise<void> => {
        await apiClient.delete('/alert-reminders');
    }
};
