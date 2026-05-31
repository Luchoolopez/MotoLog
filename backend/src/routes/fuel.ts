import { Router } from "express";
import { FuelController } from "../controllers/fuel.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new FuelController();

router.use(authMiddleware);

router.post('/', controller.create);
router.get('/moto/:motoId', controller.getHistoryByMotoId);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
