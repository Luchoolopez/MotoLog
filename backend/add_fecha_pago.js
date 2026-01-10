
require('dotenv/config');
const { Sequelize } = require('sequelize');

// Configuración de la base de datos desde variables de entorno
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: '127.0.0.1', // Force IPv4 localhost
        port: parseInt(process.env.DB_PORT || "3306"),
        dialect: "mysql",
        logging: false
    }
);

async function addFechaPagoColumn() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conectado a la base de datos');

        console.log('🔄 Ejecutando migración: agregar columna fecha_pago...');

        await sequelize.query(`
            ALTER TABLE license_insurance 
            ADD COLUMN fecha_pago DATE NULL AFTER pagado;
        `);

        console.log('✅ Migración completada exitosamente!');
        console.log('✅ Columna "fecha_pago" agregada a la tabla license_insurance');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        if (error.message && error.message.includes('Duplicate column name')) {
            console.log('⚠️  La columna "fecha_pago" ya existe en la base de datos');
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

addFechaPagoColumn();
