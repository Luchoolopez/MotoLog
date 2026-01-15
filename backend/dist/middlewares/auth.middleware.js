"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_service_1 = require("../services/auth.service");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(`[DEBUG] AuthMiddleware: Header present? ${!!authHeader}`); // LOG
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Invalid token format' });
    }
    try {
        const decoded = auth_service_1.AuthService.verifyToken(token);
        console.log(`[DEBUG] AuthMiddleware: Token verified for User ID: ${decoded.id}`); // LOG
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error(`[DEBUG] AuthMiddleware: Verification failed:`, error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
