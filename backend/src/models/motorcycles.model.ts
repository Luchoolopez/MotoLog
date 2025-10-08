import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface MotorcycleAttributes {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  current_km: number;
  created_at?: Date;
}

export type MotorcycleCreationAttributes = Optional<MotorcycleAttributes, 'id' | 'current_km' | 'created_at'>;

export class Motorcycle extends Model<MotorcycleAttributes, MotorcycleCreationAttributes> implements MotorcycleAttributes {
  public id!: number;
  public name!: string;
  public brand!: string;
  public model!: string;
  public year!: number;
  public current_km!: number;
  public readonly created_at!: Date;
}

Motorcycle.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    current_km: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'motorcycles',
    timestamps: false,
  }
);
