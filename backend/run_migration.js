require('dotenv/config');
const { Sequelize } = require('sequelize');

// Configuración de la base de datos desde variables de entorno
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

async function runMigration() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conectado a la base de datos');

        console.log('🔄 Ejecutando migración: agregar columna cobertura...');

        await sequelize.query(`
            ALTER TABLE license_insurance 
            ADD COLUMN cobertura VARCHAR(255) NULL AFTER monto;
        `);

        console.log('✅ Migración completada exitosamente!');
        console.log('✅ Columna "cobertura" agregada a la tabla license_insurance');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        if (error.message && error.message.includes('Duplicate column name')) {
            console.log('⚠️  La columna "cobertura" ya existe en la base de datos');
            console.log('✅ No es necesario ejecutar la migración');
            await sequelize.close();
            process.exit(0);
        } else {
            console.error('❌ Error ejecutando migración:', error.message);
            await sequelize.close();
            process.exit(1);
        }
    }
}

runMigration();
