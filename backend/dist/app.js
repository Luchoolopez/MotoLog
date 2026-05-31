"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApp = makeApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("./config/cors"));
const routes_1 = __importDefault(require("./routes"));
function makeApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(cors_1.default);
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use('/api', routes_1.default);
    app.use((req, res) => { res.status(404).json({ message: 'Not Found' }); });
    return app;
}
