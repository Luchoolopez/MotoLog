import { Router } from "express";
import { OdometerHistoryController } from "../controllers/odometerHistory.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new OdometerHistoryController();

router.use(authMiddleware);

// GET /api/odometer-history/moto/:motoId
router.get('/moto/:motoId', controller.getHistoryByMotoId);

export default router;
