const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

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
        logging: false
    }
);

const checkSchema = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const [results] = await sequelize.query("DESCRIBE items_plan;");
        console.log("Columns:", results.map(r => r.Field));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkSchema();
