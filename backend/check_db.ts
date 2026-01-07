
import { sequelize } from './src/config/database';

async function check() {
    try {
        await sequelize.authenticate();
        console.log('Connection OK.');

        const [tables] = await sequelize.query("SHOW TABLES");
        console.log('Tables:', JSON.stringify(tables, null, 2));

        const [historyCols] = await sequelize.query("DESCRIBE historial_mantenimiento");
        console.log('MaintenanceHistory Columns:', JSON.stringify(historyCols, null, 2));

        try {
            const [consumptionCols] = await sequelize.query("DESCRIBE historial_mantenimiento_consumo");
            console.log('HistoryConsumption Columns:', JSON.stringify(consumptionCols, null, 2));
        } catch (e) {
            console.log('historial_mantenimiento_consumo table NOT FOUND or error describing it.');
        }

    } catch (error) {
        console.error('Diagnostic error:', error);
    } finally {
        await sequelize.close();
    }
}

check();
