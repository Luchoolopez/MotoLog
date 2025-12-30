import { useState } from 'react';
import { ItemService } from '../services/item.service';
import type { CreateItemDto } from '../types/item.types';

export const useItems = () => {
    const [loading, setLoading] = useState(false);

    const addItem = async (data: CreateItemDto): Promise<boolean> => {
        try {
            setLoading(true);
            await ItemService.create(data);
            return true; 
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Error al crear la regla';
            alert(msg);
            return false; 
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id: number): Promise<boolean> => {
        if (!confirm('¿Seguro que quieres borrar esta regla?')) return false;

        try {
            setLoading(true);
            await ItemService.delete(id);
            return true;
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Error al eliminar';
            alert(msg);
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