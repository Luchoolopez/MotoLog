"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApp = makeApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("./config/cors"));
const routes_1 = require("./routes");
function makeApp() {
    const app = (0, express_1.default)();
    // Middlewares
    app.use(express_1.default.json());
    app.use(cors_1.default);
    // Rutas
    app.use(routes_1.router);
    return app;
}
//# sourceMappingURL=app.js.map