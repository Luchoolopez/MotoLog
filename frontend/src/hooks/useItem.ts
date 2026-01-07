import { useState } from 'react';
import { ItemService } from '../services/item.service';
import type { CreateItemDto } from '../types/item.types';
import { useToast } from '../context/ToastContext';

export const useItems = () => {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const addItem = async (data: CreateItemDto): Promise<boolean> => {
        try {
            setLoading(true);
            await ItemService.create(data);
            showToast('Regla creada con éxito', 'success');
            return true;
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Error al crear la regla';
            showToast(msg, 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id: number): Promise<boolean> => {
        // Confirmation is handled in the UI component now, or we keep it here but standard confirm
        // keeping logic simple for now, assuming UI handles confirmation or we keep native confirm for delete only
        // The user complained about "changing" record, likely save/update. 

        try {
            setLoading(true);
            await ItemService.delete(id);
            showToast('Regla eliminada', 'success');
            return true;
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Error al eliminar';
            showToast(msg, 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        addItem,
        deleteItem,
        loading
    };
};