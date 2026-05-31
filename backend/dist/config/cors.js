"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const whitelist = [
    'http://localhost:5173',
    'http://localhost:3000'
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (whitelist.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        console.error('Bloqueado por CORS:', origin);
        return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 204 // Importante para navegadores legacy
};
exports.default = (0, cors_1.default)(corsOptions);
