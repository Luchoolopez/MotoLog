require('dotenv/config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: '127.0.0.1', // Force localhost
        port: parseInt(process.env.DB_PORT || "3306"),
        dialect: "mysql",
        logging: false
    }
);

async function inspect() {
    try {
        console.log('Connecting to 127.0.0.1...');
        await sequelize.authenticate();
        console.log('✅ Connected');
        const [results] = await sequelize.query("DESCRIBE items_plan;");
        console.log('--- items_plan schema ---');
        console.log(JSON.stringify(results, null, 2));

        // Also check if there are any pending queries or locks? No, just schema.
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

inspect();
