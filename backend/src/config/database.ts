import 'dotenv/config';
import { Sequelize, Options } from 'sequelize';

const NODE_ENV = process.env.NODE_ENV || 'development';

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Falta variable env: ${key}`);
    }
    return value;
}

const sequelize = new Sequelize(
    process.env.DATABASE_URL as string,
    {
        dialect: "postgres",
        logging: NODE_ENV === "development" ? console.log : false,
        protocol: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);


//esta funcion permite que el mysql se configure primero antes que el back para evitar errores
async function connectWithRetry(attempts = 5, delay = 3000) {
    for (let i = 1; i <= attempts; i++) {
        try {
            await sequelize.authenticate();
            console.log("✅ DB conectada con Sequelize");
            await sequelize.sync({ alter: true });
            console.log("✅ Tablas sincronizadas");
            return true;
        } catch (error) {
            console.error(`❌ Intento ${i}/${attempts} - Error conectando a la DB`);

            if (i === attempts) {
                console.error('⛔ No se pudo establecer conexión con la base de datos.');
                throw error;
            }

            // Espera antes del próximo intento
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export { sequelize, connectWithRetry };