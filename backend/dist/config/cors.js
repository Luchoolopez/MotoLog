"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: [
        'http://localhost:5173', // frontend local
        'http://frontend:5173', // frontend en docker
        'http://localhost:80', // frontend en puerto 80
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
exports.default = (0, cors_1.default)(corsOptions);
//# sourceMappingURL=cors.js.map