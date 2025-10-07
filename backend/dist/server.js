"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config/config"));
const database_1 = require("./config/database");
const app_1 = require("./app");
async function startServer() {
    const app = (0, app_1.makeApp)();
    try {
        console.log('🔄 Conectando a la base de datos...');
        await (0, database_1.connectWithRetry)(10, 5000); // 10 intentos, 5 segundos entre cada uno
        console.log('✅ Base de datos conectada correctamente');
        // Iniciar servidor después de conectar a la DB
        app.listen(config_1.default.port, () => {
            console.log(`🚀 Servidor corriendo en el puerto: ${config_1.default.port}`);
        });
    }
    catch (error) {
        console.error('❌ Error fatal al conectar con la base de datos:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map