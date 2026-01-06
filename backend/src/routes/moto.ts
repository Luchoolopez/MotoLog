import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { MotoController } from "../controllers/moto.controller";

const motoRouter = Router();
const motoController = new MotoController();

motoRouter.post('/', authMiddleware, motoController.createMoto);
motoRouter.get('/', authMiddleware, motoController.getAll);
motoRouter.get('/:id', authMiddleware, motoController.getMotoById);
motoRouter.put('/:id', authMiddleware, motoController.update);
motoRouter.delete('/:id', authMiddleware, motoController.deleteMoto);

motoRouter.put('/km/:id', authMiddleware, motoController.updateMileage);

export default motoRouter;
export {motoRouter as Router};