export interface Fine {
    id: number;
    moto_id: number;
    type: 'Multa' | 'Service' | 'Otro';
    description: string;
    amount: number;
    date: string; // YYYY-MM-DD
    status: 'Pendiente' | 'Pagado' | 'Apelado' | 'Anulado';
    comments?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateFineDto {
    moto_id: number;
    type: 'Multa' | 'Service' | 'Otro';
    description: string;
    amount: number;
    date: string;
    status: 'Pendiente' | 'Pagado' | 'Apelado' | 'Anulado';
    comments?: string;
}
