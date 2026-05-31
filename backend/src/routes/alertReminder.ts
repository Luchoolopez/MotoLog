import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AlertReminderController } from "../controllers/alertReminder.controller";

const router = Router();
const controller = new AlertReminderController();

router.use(authMiddleware);

router.get("/", controller.getActive);
router.post("/snooze", controller.snooze);
router.delete("/", controller.clear);
router.delete("/:alertKey", controller.clear);

export default router;
