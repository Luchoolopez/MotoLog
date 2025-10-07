"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.connectWithRetry = connectWithRetry;
require("dotenv/config");
const sequelize_1 = require("sequelize");
const NODE_ENV = process.env.NODE_ENV;
function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Falta variable env: ${key}`);
    }
    return value;
}
const sequelize = new sequelize_1.Sequelize(requireEnv("DB_NAME"), requireEnv("DB_USER"), requireEnv("DB_PASSWORD"), {
    host: requireEnv("DB_HOST"),
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: "mysql",
    logging: NODE_ENV === "development" ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
exports.sequelize = sequelize;
//esta funcion permite que el mysql se configure primero antes que el back para evitar errores
async function connectWithRetry(attempts = 5, delay = 3000) {
    for (let i = 1; i <= attempts; i++) {
        try {
            await sequelize.authenticate();
            console.log("✅ DB conectada con Sequelize");
            return true;
        }
        catch (error) {
            console.error(`❌ Intento ${i}/${attempts} - Error conectando a la DB`);
            if (i === attempts) {
                throw error;
            }
            // Espera antes del próximo intento
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
//# sourceMappingURL=database.js.map