import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface OdometerHistoryAttributes {
    id: number;
    moto_id: number;
    fecha: Date;
    km: number;
    observaciones?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type OdometerHistoryCreationAttributes = Optional<OdometerHistoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'observaciones'>;

export class OdometerHistory extends Model<OdometerHistoryAttributes, OdometerHistoryCreationAttributes>
    implements OdometerHistoryAttributes {
    public id!: number;
    public moto_id!: number;
    public fecha!: Date;
    public km!: number;
    public observaciones!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OdometerHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        moto_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        km: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        observaciones: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'historial_odometro',
        modelName: 'historial_odometro',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
