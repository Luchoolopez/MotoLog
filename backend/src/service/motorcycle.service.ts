import { Motorcycle } from "../models";
import { MotorcycleValidators } from "../utils/motorcycle.validators";
import { MotorcycleFormatter } from "../utils/motorcycle.formatter";
import { Op } from "sequelize";

export class MotorcycleService {
    async createMotorcycle(data:any):Promise<any>{
        try{
            const validatedData = MotorcycleValidators.validateCreate(data);
            const created = await Motorcycle.create(validatedData);
            return MotorcycleFormatter.format(created);
        }catch(error){
            throw new Error('Error al crear la moto')
        }
    }

    async getAllMotorcycles():Promise<any[]>{
        try{
            const motorcycles = await Motorcycle.findAll();
            return motorcycles.map(MotorcycleFormatter.format);
        }catch(error){
            throw new Error('Error al obtener las motos')
        }
    }

    async getMotorcycleById(id: number): Promise<any>{
        if(!id || isNaN(Number(id))){
            throw new Error('Error, ID invalido');
        }
        const motorcycle = await Motorcycle.findByPk(id);
        if(!motorcycle){
            throw new Error('Error, moto no encontrada');
        }
    }
}