import config from './config/config';
import { connectWithRetry, sequelize } from './config/database';
import { setupAssociations } from './models/associations';
import { makeApp } from './app';

const app = makeApp();

app.listen(config.port, async () => {
    console.log(`Servidor corriendo en el puerto: ${config.port}`);
    try {
        await connectWithRetry();
        console.log('DB conectado');

        try {
            await sequelize.query(`
                ALTER TABLE items_plan 
                ADD COLUMN tipo ENUM('Inspección', 'Cambio', 'Limpieza', 'Lubricación', 'Ajuste') NOT NULL DEFAULT 'Inspección' AFTER tarea;
            `);
            console.log("✅ Columna 'tipo' agregada manualmente.");
        } catch (e: any) {
            console.log("ℹ️ La columna 'tipo' probablemente ya existe o hubo un error menor:", e.original?.sqlMessage || e.message);
        }

        setupAssociations();
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('Error conectando a la DB: ', error)
    }
})