import { Motorcycle, MotorcycleCreationAttributes } from "../models/motorcycle.model";
import { createMotorcycleType, updateMotorcycleType } from "../validations/motorcycle.schema";

export class MotoService {
    async create(data: createMotorcycleType) {
        try {
            const newMoto = await Motorcycle.create(data as MotorcycleCreationAttributes);
            return newMoto;
        } catch (error) {
            throw new Error('Error al crear la moto: ' + error);
        }
    }

    async getAll() {
        return await Motorcycle.findAll();
    }

    async getMotoById(id: number) {
        const moto = await Motorcycle.findByPk(id);
        if (!moto) {
            throw new Error('Moto no encontrada');
        }
        return moto;
    }

    async updateMileage(id: number, newKm: number) {
        const moto = await this.getMotoById(id);

        if (newKm < 0) {
            throw new Error('El nuevo kilometraje no puede ser menor a 0');
        }
        if(newKm < moto.km_actual){
            throw new Error('El nuevo kilometraje no puede ser menor al actual');
        }

        moto.km_actual = newKm;
        await moto.save();
        return moto;
    }

    async updateMoto(id: number, data: updateMotorcycleType) {
        const moto = await this.getMotoById(id);
        await moto.update(data as any);
        return moto;
    }

    //capaz lo tenga q desactivar mejor mas q borrar 
    async deleteMoto(id: number) {
        const moto = await this.getMotoById(id);
        await moto.destroy();
        return { message: 'Moto eliminada correctamente' };
    }
}