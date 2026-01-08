import { Router } from "express";
import { LicenseInsuranceController } from "../controllers/license_insurance.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware as any);

router.get("/", LicenseInsuranceController.getAll);
router.get("/moto/:motoId", LicenseInsuranceController.getByMoto);
router.post("/", LicenseInsuranceController.create);
router.put("/:id", LicenseInsuranceController.update);
router.delete("/:id", LicenseInsuranceController.delete);

export default router;
