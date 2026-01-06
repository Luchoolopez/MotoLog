import { Router } from "express";
import AuthRoutes from "./auth";
import MotoRoutes from "./moto";
import PlanRoutes from "./plan";
import ItemRoutes from "./item";
import HistoryRoutes from "./history";
import CalculatorRoutes from "./calculator";

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/motos', MotoRoutes);
router.use('/planes', PlanRoutes);
router.use('/items', ItemRoutes);
router.use('/historial', HistoryRoutes);
router.use('/status', CalculatorRoutes);

export default router;