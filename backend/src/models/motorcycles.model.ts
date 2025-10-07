import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface MotoAttributes {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  current_km: number;
  created_at?: Date;
}

export type MotoCreationAttributes = Optional<MotoAttributes, "id" | "created_at">;

export class Moto extends Model<MotoAttributes, MotoCreationAttributes>
  implements MotoAttributes {
  public id!: number;
  public name!: string;
  public brand!: string;
  public model!: string;
  public year!: number;
  public current_km!: number;
  public created_at!: Date;
}

Moto.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
      allowNull: true,
    },
    current_km: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "motorcycles",
    modelName: "Moto",
    timestamps: false,
  }
);
