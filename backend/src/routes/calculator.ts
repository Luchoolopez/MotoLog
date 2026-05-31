import { Router } from "express";
import { MaintenanceCalculatorController } from "../controllers/maintenanceCalculator.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const calculatorRouter = Router();
const calculatorController = new MaintenanceCalculatorController();

calculatorRouter.use(authMiddleware);

calculatorRouter.get('/:id', calculatorController.calculateStatus);

export default calculatorRouter;
export {calculatorRouter as Router};
