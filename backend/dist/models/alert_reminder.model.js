"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertReminder = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class AlertReminder extends sequelize_1.Model {
}
exports.AlertReminder = AlertReminder;
AlertReminder.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    alert_key: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    snoozed_until: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize,
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
});
