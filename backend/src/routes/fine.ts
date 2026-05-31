import { Router } from 'express';
import { FineController } from '../controllers/fine.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', FineController.create);
router.get('/:motoId', FineController.getByMoto);
router.put('/:id', FineController.update);
router.delete('/:id', FineController.delete);

export default router;
