import { Router } from 'express';
import { FineController } from '../controllers/fine.controller';

const router = Router();

router.get('/debug-sync', FineController.debugSync); // Temporary debug route
router.get('/debug-reset', FineController.debugReset); // Temporary nuclear option
router.get('/debug-inspect', FineController.debugInspect); // Check schema
router.get('/debug-create', FineController.debugCreate); // Test create

router.post('/', FineController.create);
router.get('/:motoId', FineController.getByMoto);
router.put('/:id', FineController.update);
router.delete('/:id', FineController.delete);

export default router;
