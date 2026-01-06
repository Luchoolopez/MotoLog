import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export class AuthService {

    static async register(name: string, email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        return user;
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
        return { user, token };
    }

    static verifyToken(token: string): { id: number; email: string } {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as jwt.JwtPayload;
            return { id: decoded.id as number, email: decoded.email as string };
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}