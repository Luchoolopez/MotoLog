import { sequelize } from './src/config/database';
import { QueryTypes } from 'sequelize';
require('dotenv').config();

// Override DB_HOST for local execution if needed
if (process.env.DB_HOST === 'mysql') {
    process.env.DB_HOST = 'localhost';
}

const checkSchema = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const [results] = await sequelize.query("DESCRIBE items_plan;");
        console.log("Columns in items_plan table:", results);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

checkSchema();
