export class MotorcycleValidators{
    static validateCreate(data:any){
        if(!data.model || !data.brand){
            throw new Error('Faltan datos obligatorios');
        }
        return data;
    }

    static validateUpdate(data:any){
        return data;
    }
}