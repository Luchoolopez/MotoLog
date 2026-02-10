import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { createUserSchema, loginSchema } from '../validations/user.schema';

export class AuthController {

    static async register(req: Request, res: Response) {
        try {
            const validatedData = createUserSchema.parse(req.body);
            const { user, token } = await AuthService.register(validatedData.name, validatedData.email, validatedData.password);
            res.status(201).json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email }, token });
        } catch (error: any) {
            if (error?.name === 'ZodError' && Array.isArray(error?.errors)) {
                res.status(400).json({ error: JSON.stringify(error.errors) });
                return;
            }

            if (error?.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({ error: 'Email already registered' });
                return;
            }

            res.status(400).json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const { user, token } = await AuthService.login(validatedData.email, validatedData.password);
            res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email }, token });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}