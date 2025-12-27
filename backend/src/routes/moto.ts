import { Router } from "express";
import { MotoController } from "../controllers/moto.controller";

const motoRouter = Router();
const motoController = new MotoController();

motoRouter.post('/', motoController.createMoto);
motoRouter.get('/', motoController.getAll);
motoRouter.get('/:id', motoController.getMotoById);
motoRouter.put('/:id', motoController.update);
motoRouter.delete('/:id', motoController.deleteMoto);

motoRouter.put('/km/:id', motoController.updateMileage);

export default motoRouter;
export {motoRouter as Router};