import { Motorcycle, MotorcycleCreationAttributes } from "../models/motorcycles.model";
import { MotorcycleValidators, MotorcycleUpdateAttributes } from "../utils/motorcycle.validators";
import { MotorcycleFormatter } from "../utils/motorcycle.formatter";

// Define una interfaz para el objeto de motocicleta formateado que devuelve tu API.
// Esto mejora la seguridad de tipos en todo tu código.
interface FormattedMotorcycle {
    id: number;
    brand: string;
    model: string;
    current_km: number;
}

export class MotorcycleService {
    async createMotorcycle(data: MotorcycleCreationAttributes): Promise<FormattedMotorcycle> {
        try {
            const validatedData = MotorcycleValidators.validateCreate(data);
            const created = await Motorcycle.create(validatedData);
            return MotorcycleFormatter.format(created);
        } catch (error) {
            console.error("Error in createMotorcycle:", error);
            throw new Error('Error al crear la moto');
        }
    }

    async getAllMotorcycles(): Promise<FormattedMotorcycle[]> {
        try {
            const motorcycles = await Motorcycle.findAll();
            return motorcycles.map(MotorcycleFormatter.format);
        } catch (error) {
            console.error("Error in getAllMotorcycles:", error);
            throw new Error('Error al obtener las motos');
        }
    }

    async getMotorcycleById(id: number): Promise<FormattedMotorcycle> {
        try {
            if (!id || id <= 0) {
                throw new Error('Error, ID invalido');
            }
            const motorcycle = await Motorcycle.findByPk(id);
            if (!motorcycle) {
                throw new Error('Error, moto no encontrada');
            }
            return MotorcycleFormatter.format(motorcycle);
        } catch (error) {
            console.error(`Error al obtener la moto, ${id}`);
            throw new Error('Error al obtener la moto');
        }
    }

    async updateMotorcycle(id: number, updateData: MotorcycleUpdateAttributes): Promise<FormattedMotorcycle> {
        try {
            if (!id || id <= 0) {
                throw new Error('Error, ID invalido');
            }
            const validatedData = MotorcycleValidators.validateUpdate(updateData);

            const motorcycle = await Motorcycle.findByPk(id);
            if (!motorcycle) {
                throw new Error('Error, moto no encontrada');
            }

            const updatedMotorcycle = await motorcycle.update(validatedData);

            return MotorcycleFormatter.format(updatedMotorcycle);
        } catch (error) {
            console.error('Error al actualizar la moto!:', error);
            throw error;
        }
    }

    async deleteMotorcycle(id: number): Promise<void> {
        try {
            if (!id || id <= 0) {
                throw new Error('Error, ID invalido');
            }
            const motorcycle = await Motorcycle.findByPk(id);
            if (!motorcycle) {
                throw new Error('Error, moto no encontrada');
            }
            await motorcycle.destroy();
        } catch (error) {
            console.error(`Error al eliminar la moto con id ${id}:`, error);
            throw new Error('Error al eliminar la moto');
        }
    }
}