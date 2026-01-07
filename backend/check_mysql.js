
const mysql = require('mysql2/promise');

async function check() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'motolog'
        });

        console.log('Connected to MySQL.');

        const [tables] = await connection.query("SHOW TABLES");
        console.log('Tables:', JSON.stringify(tables, null, 2));

        const [history] = await connection.query("DESCRIBE historial_mantenimiento");
        console.log('History:', JSON.stringify(history, null, 2));

        try {
            const [consumption] = await connection.query("DESCRIBE historial_mantenimiento_consumo");
            console.log('Consumption:', JSON.stringify(consumption, null, 2));
        } catch (e) {
            console.log('Consumption table NOT FOUND');
        }

        await connection.end();
    } catch (error) {
        console.error('MySQL Error:', error);
    }
}

check();
