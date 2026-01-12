import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Fine extends Model {
    public id!: number;
    public moto_id!: number;
    public type!: 'Multa' | 'Tramite' | 'Otro';
    public description!: string;
    public amount!: number;
    public date!: string; // Fecha del incidente o vencimiento
    public status!: 'Pendiente' | 'Pagado' | 'Apelado' | 'Anulado';
    public comments!: string;
}

Fine.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    moto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('Multa', 'Service', 'Otro'),
        allowNull: false,
        defaultValue: 'Multa'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false, // Ej: "Exceso de velocidad", "Renovación Licencia"
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pendiente', 'Pagado', 'Apelado', 'Anulado'),
        allowNull: false,
        defaultValue: 'Pendiente',
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Fine',
    tableName: 'fines',
});
