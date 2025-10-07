export class MotorcycleFormatter {
    static format(motorcycle: any) {
        const { id, brand, model, current_km, created_at } = motorcycle;
        return { id, brand, model, current_km };
    }
}
