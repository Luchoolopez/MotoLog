"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config/config"));
const database_1 = require("./config/database");
const associations_1 = require("./models/associations");
const app_1 = require("./app");
const app = (0, app_1.makeApp)();
app.listen(config_1.default.port, async () => {
    console.log(`Servidor corriendo en el puerto: ${config_1.default.port}`);
    try {
        await (0, database_1.connectWithRetry)();
        (0, associations_1.setupAssociations)();
        await database_1.sequelize.sync({ alter: true });
    }
    catch (error) {
        console.error('Error conectando a la DB: ', error);
    }
});
