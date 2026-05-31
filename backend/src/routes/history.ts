import { Router } from "express";
import { MaintenanceHistoryController } from "../controllers/maintenanceHistory.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const historyRouter = Router();
const historyController = new MaintenanceHistoryController();

historyRouter.use(authMiddleware);

historyRouter.post('/', historyController.createHistory);
historyRouter.put('/:id', historyController.updateHistory);
historyRouter.delete('/:id', historyController.deleteHistory);

historyRouter.get('/moto/:id', historyController.getByMotoId);

export default historyRouter;
export { historyRouter as Router };
