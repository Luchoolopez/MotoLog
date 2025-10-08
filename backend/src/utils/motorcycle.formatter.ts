import { Motorcycle } from "../models";

export class MotorcycleFormatter {
    static format(motorcycle: Motorcycle) {
        const { id, brand, model, current_km, created_at } = motorcycle;
        return { id, brand, model, current_km };
    }
}
