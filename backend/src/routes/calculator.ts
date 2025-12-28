import { Router } from "express";
import { MaintenanceCalculatorController } from "../controllers/maintenanceCalculator.controller";

const calculatorRouter = Router();
const calculatorController = new MaintenanceCalculatorController();

calculatorRouter.get('/:id', calculatorController.calculateStatus);

export default calculatorRouter;
export {calculatorRouter as Router};