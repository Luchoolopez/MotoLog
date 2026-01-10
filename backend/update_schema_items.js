const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Override DB_HOST for local execution if needed
if (process.env.DB_HOST === 'mysql') {
    process.env.DB_HOST = 'localhost';
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: console.log
    }
);

const updateSchema = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Add 'tipo' column to items_plan table
        try {
            await sequelize.query(`
                ALTER TABLE items_plan 
                ADD COLUMN tipo ENUM('Inspección', 'Cambio', 'Limpieza', 'Lubricación', 'Ajuste') NOT NULL DEFAULT 'Inspección' AFTER tarea;
            `);
            console.log("Column 'tipo' added to items_plan.");
        } catch (error) {
            if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
                console.log("Column 'tipo' already exists.");
            } else {
                console.error("Error adding column 'tipo':", error);
            }
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

updateSchema();
