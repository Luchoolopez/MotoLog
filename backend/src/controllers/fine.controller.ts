import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { FineService } from '../services/fine.service';

export class FineController {
    static async create(req: AuthRequest, res: Response) {
        try {
            console.log('[FineController] Creating fine:', req.body);
            const data = req.body;
            const record = await FineService.create(data, req.user!.id);
            res.json(record);
        } catch (error: any) {
            console.error('[FineController] Create ERROR:', error);
            res.status(500).json({ message: error.message || 'Error creating fine', error: error.toString() });
        }
    }

    static async getByMoto(req: AuthRequest, res: Response) {
        try {
            const { motoId } = req.params;
            console.log('[FineController] Getting fines for moto:', motoId);
            const records = await FineService.getAllByMotoId(Number(motoId), req.user!.id);
            res.json(records);
        } catch (error: any) {
            console.error('[FineController] GetByMoto ERROR:', error);
            res.status(500).json({ message: error.message || 'Error getting fines', error: error.toString() });
        }
    }

    static async update(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const updated = await FineService.update(Number(id), req.body, req.user!.id);
            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            await FineService.delete(Number(id), req.user!.id);
            res.json({ message: 'Eliminado correctamente' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

}
