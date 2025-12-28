import { Router } from "express";
import { PlanController } from "../controllers/plan.controller";

const planRouter = Router();
const planController = new PlanController();

planRouter.post('/', planController.createPlan);
planRouter.get('/', planController.getAllPlans);
planRouter.get('/:id', planController.getPlanById);
planRouter.put('/:id', planController.updatePlan);
planRouter.delete('/:id', planController.deletePlan);

export default planRouter;
export {planRouter as Router};
