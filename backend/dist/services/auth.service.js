"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
class AuthService {
    static async register(name, email, password) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await user_model_1.User.create({ name, email, password: hashedPassword });
        return user;
    }
    static async login(email, password) {
        const user = await user_model_1.User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
        return { user, token };
    }
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
            return { id: decoded.id, email: decoded.email };
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
exports.AuthService = AuthService;
