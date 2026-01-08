import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class LicenseInsurance extends Model {
    public id!: number;
    public moto_id!: number;
    public user_id!: number;
    public tipo!: 'Patente' | 'Seguro';
    public entidad!: string;
    public nro_documento!: string;
    public fecha_vencimiento!: string;
    public monto!: number;
    public observaciones!: string;
}

LicenseInsurance.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    moto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.ENUM('Patente', 'Seguro'),
        allowNull: false,
    },
    entidad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nro_documento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'LicenseInsurance',
    tableName: 'license_insurance',
});
