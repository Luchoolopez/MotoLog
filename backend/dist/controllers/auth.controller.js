"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const user_schema_1 = require("../validations/user.schema");
class AuthController {
    static async register(req, res) {
        try {
            const validatedData = user_schema_1.createUserSchema.parse(req.body);
            const user = await auth_service_1.AuthService.register(validatedData.name, validatedData.email, validatedData.password);
            res.status(201).json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email } });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const validatedData = user_schema_1.loginSchema.parse(req.body);
            const { user, token } = await auth_service_1.AuthService.login(validatedData.email, validatedData.password);
            res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email }, token });
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
