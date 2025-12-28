import cors from 'cors';

const corsOptions: cors.CorsOptions = {
    origin: [
        'http://localhost:5173', // frontend local
        'http://frontend:5173', // frontend en docker
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

export default cors(corsOptions);