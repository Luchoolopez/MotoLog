import config from "./config/config";
import { connectWithRetry } from "./config/database";
import { makeApp } from "./app";

async function startServer() {
    const app = makeApp();

    try {
        console.log('🔄 Conectando a la base de datos...');
        await connectWithRetry(10, 5000); // 10 intentos, 5 segundos entre cada uno
        
        console.log('✅ Base de datos conectada correctamente');
        
        // Iniciar servidor después de conectar a la DB
        app.listen(config.port, () => {
            console.log(`🚀 Servidor corriendo en el puerto: ${config.port}`);
        });

    } catch (error) {
        console.error('❌ Error fatal al conectar con la base de datos:', error);
        process.exit(1);
    }
}

startServer();