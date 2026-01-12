import { Router } from 'express';
import { FineController } from '../controllers/fine.controller';

const router = Router();

router.post('/', FineController.create);
router.get('/:motoId', FineController.getByMoto);
router.put('/:id', FineController.update);
router.delete('/:id', FineController.delete);

export default router;
