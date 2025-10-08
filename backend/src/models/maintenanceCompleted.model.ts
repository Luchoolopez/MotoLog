import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../config/database';
import { Motorcycle } from './motorcycles.model';
import { MaintenanceInterval } from './maintenanceInterval.model';

export interface CompletedMaintenanceAttributes {
  id: number;
  motorcycle_id: number;
  maintenance_interval_id: number;
  km_performed: number;
  performed_at?: Date;
  notes?: string;
}

export type CompletedMaintenanceCreationAttributes = Optional<CompletedMaintenanceAttributes,'id' | 'performed_at' | 'notes'>;

export class CompletedMaintenance
  extends Model<CompletedMaintenanceAttributes, CompletedMaintenanceCreationAttributes>
  implements CompletedMaintenanceAttributes
{
  public id!: number;
  public motorcycle_id!: number;
  public maintenance_interval_id!: number;
  public km_performed!: number;
  public performed_at!: Date;
  public notes?: string;
}

CompletedMaintenance.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    motorcycle_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    maintenance_interval_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    km_performed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    performed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    notes: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: 'completed_maintenances',
    timestamps: false,
  }
);

Motorcycle.hasMany(CompletedMaintenance, { foreignKey: 'motorcycle_id' });
CompletedMaintenance.belongsTo(Motorcycle, { foreignKey: 'motorcycle_id' });

MaintenanceInterval.hasMany(CompletedMaintenance, { foreignKey: 'maintenance_interval_id' });
CompletedMaintenance.belongsTo(MaintenanceInterval, { foreignKey: 'maintenance_interval_id' });
