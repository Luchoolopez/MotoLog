import { Router } from "express";
import { MaintenanceHistoryController } from "../controllers/maintenanceHistory.controller";

const historyRouter = Router();
const historyController = new MaintenanceHistoryController();

historyRouter.post('/', historyController.createHistory);
historyRouter.put('/:id', historyController.updateHistory); 
historyRouter.delete('/:id', historyController.deleteHistory); 

historyRouter.get('/moto/:id', historyController.getByMotoId);

export default historyRouter;
export {historyRouter as Router};