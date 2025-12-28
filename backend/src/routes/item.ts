import { Router } from "express";
import { ItemController } from "../controllers/item.controller";

const itemRouter = Router();
const itemController = new ItemController();

itemRouter.post('/', itemController.createItem);
itemRouter.get('/', itemController.getAllItems);
itemRouter.get('/:id', itemController.getItemById);
itemRouter.put('/:id', itemController.updateItem);
itemRouter.delete('/:id', itemController.deleteItem);

itemRouter.get('/plan/:id', itemController.getItemsByPlanId);

export default itemRouter;
export {itemRouter as Router};