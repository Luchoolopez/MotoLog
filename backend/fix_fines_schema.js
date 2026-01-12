require('dotenv/config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: '127.0.0.1',
        port: parseInt(process.env.DB_PORT || "3306"),
        dialect: "mysql",
        logging: false
    }
);

async function fix() {
    try {
        console.log('Connecting to DB...');
        await sequelize.authenticate();
        console.log('✅ Connected. Dropping table "fines"...');

        await sequelize.query("DROP TABLE IF EXISTS fines;");

        console.log('✅ Table dropped. Restart backend to recreate it.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fix();
