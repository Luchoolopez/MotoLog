import { Router } from "express";
import { WarehouseController } from "../controllers/warehouse.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new WarehouseController();

router.use(authMiddleware);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.get("/:id/history", controller.getHistory);

export default router;
