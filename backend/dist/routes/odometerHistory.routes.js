"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const odometerHistory_controller_1 = require("../controllers/odometerHistory.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const controller = new odometerHistory_controller_1.OdometerHistoryController();
router.use(auth_middleware_1.authMiddleware);
// GET /api/odometer-history/moto/:motoId
router.get('/moto/:motoId', controller.getHistoryByMotoId);
exports.default = router;
