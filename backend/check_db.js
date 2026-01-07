
const { sequelize } = require('./src/config/database');
const { MaintenanceHistoryConsumption } = require('./src/models/maintenance_history_consumption.model');
const { MaintenanceHistory } = require('./src/models/maintenance_history.model');
const { WarehouseItem } = require('./src/models/warehouse_item.model');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const tables = await sequelize.query("SHOW TABLES");
        console.log('Tables:', JSON.stringify(tables[0], null, 2));

        const historyCols = await sequelize.query("DESCRIBE historial_mantenimiento");
        console.log('MaintenanceHistory Columns:', JSON.stringify(historyCols[0], null, 2));

        const consumptionCols = await sequelize.query("DESCRIBE historial_mantenimiento_consumo");
        console.log('HistoryConsumption Columns:', JSON.stringify(consumptionCols[0], null, 2));

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

check();
