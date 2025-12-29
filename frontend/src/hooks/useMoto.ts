import { useState, useEffect, useCallback } from "react";
import { MotoService } from "../services/moto.service";
import type { Motorcycle } from "../types/moto.types";

export const useMotos = () => {
    const [motos, setMotos] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    //callback se usa para memorizar la funcion y evitar re-renderizados infinitos
    const fetchMotos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await MotoService.getAll();
            setMotos(data);
            setError(null)
        } catch (error: any) {
            console.error(error);
            setError('No se pudo cargar el Garage')
        } finally {
            setLoading(false);
        }
    }, []);

    const removeMoto = async (id: number) => {
        try {
            await MotoService.delete(id);
            setMotos(prevMotos => prevMotos.filter(moto => moto.id !== id));
            return true;
        } catch (error: any) {
            alert('Error al eliminar la moto: ' + (error.message || 'Desconocido'));
            return false;
        }
    };

    useEffect(() => {
        fetchMotos();
    }, [fetchMotos]);

    return {
        motos,
        loading,
        error,
        removeMoto,
        refreshMotos: fetchMotos
    };
}