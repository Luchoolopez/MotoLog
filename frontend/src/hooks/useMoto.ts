import { useState, useEffect, useCallback } from "react";
import { MotoService } from "../services/moto.service";
import { PlanService } from "../services/planService.service"; // Importamos esto aquí
import type { Motorcycle, CreateMotoDto } from "../types/moto.types";

export const useMotos = () => {
    const [motos, setMotos] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMotos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await MotoService.getAll();
            setMotos(data);
            setError(null);
        } catch (error: any) {
            console.error(error);
            setError('No se pudo cargar el Garage');
        } finally {
            setLoading(false);
        }
    }, []);

    const addMoto = async (formData: { 
        marca: string, 
        modelo: string, 
        anio:number,
        patente: string, 
        km_actual: number, 
        fecha_compra: string 
    }) => {
        try {
            setLoading(true);

            const nuevoPlan = await PlanService.create({
                nombre: `Plan de ${formData.marca} ${formData.modelo}`,
                descripcion: `Plan personalizado para patente ${formData.patente}`
            });

            const nuevaMotoData: CreateMotoDto = {
                marca: formData.marca,
                modelo: formData.modelo,
                anio:formData.anio,
                patente: formData.patente,
                km_actual: Number(formData.km_actual),
                fecha_compra: formData.fecha_compra ? formData.fecha_compra : undefined, 
                plan_id: nuevoPlan.id
            };

            const motoCreada = await MotoService.create(nuevaMotoData);

            setMotos(prev => [...prev, motoCreada]);
            
            return true; 
        } catch (error: any) {
            console.error(error);
            alert('Error al crear moto: ' + (error.response?.data?.message || error.message));
            return false; 
        } finally {
            setLoading(false);
        }
    };

    const removeMoto = async (id: number) => {
        try {
            await MotoService.delete(id);
            setMotos(prevMotos => prevMotos.filter(moto => moto.id !== id));
            return true;
        } catch (error: any) {
            alert('Error al eliminar: ' + (error.message || 'Desconocido'));
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
        addMoto,     
        removeMoto,
        refreshMotos: fetchMotos
    };
}