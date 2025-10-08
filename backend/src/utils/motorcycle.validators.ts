import { MotorcycleCreationAttributes } from "../models/motorcycles.model";

export type MotorcycleUpdateAttributes = Partial<MotorcycleCreationAttributes>;

export class MotorcycleValidators {
    static validateCreate(data: MotorcycleCreationAttributes): MotorcycleCreationAttributes {
        if(!data.model?.trim() || !data.brand?.trim()){
            throw new Error('Los campos "model" y "brand" son obligatorios.');
        }
        return data;
    }

    static validateUpdate(data: MotorcycleUpdateAttributes): MotorcycleUpdateAttributes {
        if (Object.keys(data).length === 0) {
            throw new Error('No se proporcionaron datos para actualizar.');
        }

        if (data.brand || data.model) {
            throw new Error('La marca y el modelo no se pueden modificar.');
        }

        if (data.current_km !== undefined) {
            if (typeof data.current_km !== 'number' || isNaN(data.current_km)) {
                throw new Error('El kilometraje (current_km) debe ser un número válido.');
            }
            if (data.current_km < 0) {
                throw new Error('El kilometraje (current_km) no puede ser negativo.');
            }
        }

        return data;
    }
}