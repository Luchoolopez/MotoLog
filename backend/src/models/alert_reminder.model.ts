import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface AlertReminderAttributes {
    id: number;
    user_id: number;
    alert_key: string;
    snoozed_until: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

type AlertReminderCreationAttributes = Optional<AlertReminderAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class AlertReminder extends Model<AlertReminderAttributes, AlertReminderCreationAttributes>
    implements AlertReminderAttributes {
    public id!: number;
    public user_id!: number;
    public alert_key!: string;
    public snoozed_until!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

AlertReminder.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        alert_key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        snoozed_until: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'alert_reminders',
        modelName: 'alert_reminder',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'alert_key']
            }
        ]
    }
);
