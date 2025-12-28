import express from "express";
import cors from 'cors';
import router  from "./routes";

export function makeApp() {
    const app = express();
    app.use(express.json())

    const corsOptions = {
        origin: [
            'http://localhost:5173',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-type, Authorization',
        optionSuccessStatus: 204,
    };
    // Middlewares
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: true }));


    // Rutas
    app.use('/api', router);
    app.use((req, res) => { res.status(404).json({ message: 'Not Found' }) });


    return app;
}
