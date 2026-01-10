require('dotenv/config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "3306"),
        dialect: "mysql",
        logging: false
    }
);

async function inspect() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected');
        const [results] = await sequelize.query("DESCRIBE items_plan;");
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

inspect();
