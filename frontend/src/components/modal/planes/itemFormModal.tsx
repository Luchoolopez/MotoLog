import React, { useState } from "react";
import type { CreateItemDto } from "../../../types/item.types";

interface Props {
    show: boolean;
    onClose: () => void;
    planId: number;
    onSubmit: (data: CreateItemDto) => Promise<boolean>;
    onSuccess: () => void; 
}

export const ItemFormModal = ({ show, onClose, planId, onSubmit, onSuccess }: Props) => {
    const [formData, setFormData] = useState({
        tarea: '',
        intervalo_km: 3000,
        intervalo_meses: 6
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.tarea.trim()) return alert("La tarea es obligatoria");

        setIsSubmitting(true);

        const newItem: CreateItemDto = {
            plan_id: planId,
            tarea: formData.tarea,
            intervalo_km: Number(formData.intervalo_km),
            intervalo_meses: Number(formData.intervalo_meses)
        };

        const success = await onSubmit(newItem);
        
        setIsSubmitting(false);

        if (success) {
            setFormData({ tarea: '', intervalo_km: 3000, intervalo_meses: 6 });
            onSuccess();
            onClose();
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nueva Regla de Mantenimiento</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Tarea</label>
                                <input 
                                    type="text" className="form-control" 
                                    placeholder="Ej: Cambio de Aceite"
                                    value={formData.tarea}
                                    onChange={e => setFormData({...formData, tarea: e.target.value})}
                                    autoFocus required
                                />
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Intervalo KM</label>
                                    <input 
                                        type="number" className="form-control" 
                                        value={formData.intervalo_km}
                                        onChange={e => setFormData({...formData, intervalo_km: Number(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Intervalo Meses</label>
                                    <input 
                                        type="number" className="form-control" 
                                        value={formData.intervalo_meses}
                                        onChange={e => setFormData({...formData, intervalo_meses: Number(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar Regla'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};