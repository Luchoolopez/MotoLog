import { Router } from "express";
import AuthRoutes from "./auth";
import MotoRoutes from "./moto";
import PlanRoutes from "./plan";
import ItemRoutes from "./item";
import HistoryRoutes from "./history";
import CalculatorRoutes from "./calculator";
import OdometerHistoryRoutes from "./odometerHistory.routes";
import FuelRoutes from "./fuel";
import warehouseRoutes from './warehouse';
import LicenseInsuranceRoutes from './license_insurance';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/motos', MotoRoutes);
router.use('/planes', PlanRoutes);
router.use('/items', ItemRoutes);
router.use('/historial', HistoryRoutes);
router.use('/status', CalculatorRoutes);
router.use('/odometer-history', OdometerHistoryRoutes);
router.use('/fuel', FuelRoutes);
router.use('/warehouse', warehouseRoutes);
console.log('[DEBUG] Registering /docs route');
router.use('/docs', LicenseInsuranceRoutes);

export default router;