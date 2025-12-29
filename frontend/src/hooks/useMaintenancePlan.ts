import { useState, useEffect, useCallback } from 'react';
import type { MaintenancePlan } from '../types/maintenancePlan';
import { PlanService } from '../services/planService.service';

export const usePlanes = () => {
    const [planes, setPlanes] = useState<MaintenancePlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlanes = useCallback(async () => {
        try {
            setLoading(true);
            const data = await PlanService.getAll();
            setPlanes(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los planes');
        } finally {
            setLoading(false);
        }
    }, []);

    const removePlan = async (id: number) => {
        try {
            await PlanService.delete(id);
            setPlanes(prev => prev.filter(p => p.id !== id));
            return true;
        } catch (err: any) {
            alert('Error al eliminar: ' + (err.message || 'Desconocido'));
            return false;
        }
    };

    useEffect(() => {
        fetchPlanes();
    }, [fetchPlanes]);

    return {
        planes,
        loading,
        error,
        removePlan,
        refreshPlanes: fetchPlanes 
    };
};