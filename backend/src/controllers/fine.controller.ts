import { Request, Response } from 'express';
import { FineService } from '../services/fine.service';

export class FineController {
    static async create(req: Request, res: Response) {
        try {
            console.log('[FineController] Creating fine:', req.body);
            const data = req.body;
            const record = await FineService.create(data);
            res.json(record);
        } catch (error: any) {
            console.error('[FineController] Create ERROR:', error);
            res.status(500).json({ message: error.message || 'Error creating fine', error: error.toString() });
        }
    }

    static async getByMoto(req: Request, res: Response) {
        try {
            const { motoId } = req.params;
            console.log('[FineController] Getting fines for moto:', motoId);
            const records = await FineService.getAllByMotoId(Number(motoId));
            res.json(records);
        } catch (error: any) {
            console.error('[FineController] GetByMoto ERROR:', error);
            res.status(500).json({ message: error.message || 'Error getting fines', error: error.toString() });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updated = await FineService.update(Number(id), req.body);
            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await FineService.delete(Number(id));
            res.json({ message: 'Eliminado correctamente' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async debugSync(req: Request, res: Response) {
        try {
            console.log('[FineController] Force Syncing Fines Table...');
            const { Fine } = require('../models/fine.model');
            await Fine.sync({ alter: true });
            res.json({ message: 'Table Fines synced successfully!' });
        } catch (error: any) {
            console.error('[FineController] Sync Error:', error);
            res.status(500).json({ message: error.message, error: error.toString() });
        }
    }

    static async debugReset(req: Request, res: Response) {
        try {
            console.log('[FineController] DROPPING and Re-creating Fines Table...');
            const { Fine } = require('../models/fine.model');
            await Fine.drop();
            await Fine.sync({ force: true });
            res.json({ message: 'Table Fines DROPPED and RE-CREATED successfully!' });
        } catch (error: any) {
            console.error('[FineController] Reset Error:', error);
            res.status(500).json({ message: error.message, error: error.toString() });
        }
    }
    static async debugInspect(req: Request, res: Response) {
        try {
            const { sequelize } = require('../config/database');
            const [results] = await sequelize.query("DESCRIBE fines;");
            res.json({ schema: results });
        } catch (error: any) {
            res.status(500).json({ message: error.message, error: error.toString() });
        }
    }

    static async debugCreate(req: Request, res: Response) {
        try {
            console.log('[FineController] Debug Creating Fine...');
            const { Fine } = require('../models/fine.model');
            // Try to create a dummy fine for the first found moto
            const { Motorcycle } = require('../models/motorcycle.model');
            const moto = await Motorcycle.findOne();
            if (!moto) return res.status(404).json({ message: 'No motos found to test with' });

            const dummy = {
                moto_id: moto.id,
                type: 'Service',
                description: 'Debug Service Test',
                amount: 100,
                date: new Date().toISOString().split('T')[0],
                status: 'Pendiente',
                comments: 'Created by Debug Tool'
            };

            const record = await Fine.create(dummy);
            res.json({ message: 'Success!', record });
        } catch (error: any) {
            res.status(500).json({ message: error.message, stack: error.toString() });
        }
    }
}
