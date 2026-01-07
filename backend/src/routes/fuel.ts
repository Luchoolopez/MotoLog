import { Router } from "express";
import { FuelController } from "../controllers/fuel.controller";

const router = Router();
const controller = new FuelController();

router.post('/', controller.create);
router.get('/moto/:motoId', controller.getHistoryByMotoId);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
