import { Router } from "express";
import { OdometerHistoryController } from "../controllers/odometerHistory.controller";

const router = Router();
const controller = new OdometerHistoryController();

// GET /api/odometer-history/moto/:motoId
router.get('/moto/:motoId', controller.getHistoryByMotoId);

export default router;
