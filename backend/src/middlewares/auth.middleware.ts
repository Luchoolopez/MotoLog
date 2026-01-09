import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export interface AuthRequest extends Request {
    user?: { id: number; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
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
        const decoded = AuthService.verifyToken(token);
        console.log(`[DEBUG] AuthMiddleware: Token verified for User ID: ${decoded.id}`); // LOG
        req.user = decoded;
        next();
    } catch (error) {
        console.error(`[DEBUG] AuthMiddleware: Verification failed:`, error);
        res.status(401).json({ error: 'Invalid token' });
    }
};