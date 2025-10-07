import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface MaintenanceAttributes {
  id: number;
  item: string;
  description?: string | null; 
  notes?: string | null;      
}

export type MaintenanceCreationAttributes = Optional<MaintenanceAttributes, "id">;

export class Maintenance
  extends Model<MaintenanceAttributes, MaintenanceCreationAttributes>
  implements MaintenanceAttributes {
  public id!: number;
  public item!: string;
  public description!: string | null;
  public notes!: string | null;
}

Maintenance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
  },
  {
    sequelize,
    tableName: "maintenances",
    modelName: "Maintenance",
    timestamps: false,
  }
);
