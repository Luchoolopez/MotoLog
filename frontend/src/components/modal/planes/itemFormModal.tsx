import React, { useState } from "react";
import { useToast } from "../../../context/ToastContext";
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
        tipo: 'Inspección' as 'Inspección' | 'Cambio' | 'Limpieza' | 'Lubricación' | 'Ajuste',
        intervalo_km: 0 as string | number,
        intervalo_meses: 0 as string | number,
        consumo_sistematico: false,
        associated_items: [] as { warehouse_item_id: number, cantidad_sugerida: number }[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { showToast } = useToast();

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.tarea.trim()) return showToast("La tarea es obligatoria", 'warning');

        setIsSubmitting(true);

        const newItem: CreateItemDto = {
            plan_id: planId,
            tarea: formData.tarea,
            tipo: formData.tipo,
            intervalo_km: Number(formData.intervalo_km),
            intervalo_meses: Number(formData.intervalo_meses),
            consumo_sistematico: formData.consumo_sistematico,
            associated_items: []
        };

        const success = await onSubmit(newItem);

        setIsSubmitting(false);

        if (success) {
            setFormData({ tarea: '', tipo: 'Inspección', intervalo_km: 0, intervalo_meses: 0, consumo_sistematico: false, associated_items: [] });
            onSuccess();
            onClose();
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(5px)' }}>
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
                                    onChange={e => setFormData({ ...formData, tarea: e.target.value })}
                                    autoFocus required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tipo de Tarea</label>
                                <select
                                    className="form-select"
                                    value={formData.tipo}
                                    onChange={e => setFormData({ ...formData, tipo: e.target.value as any })}
                                >
                                    <option value="Inspección">Inspección - (I)</option>
                                    <option value="Cambio">Cambio / Reemplazo - (R)</option>
                                    <option value="Limpieza">Limpieza - (C)</option>
                                    <option value="Lubricación">Lubricación - (L)</option>
                                    <option value="Ajuste">Ajuste - (A)</option>
                                </select>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Intervalo KM</label>
                                    <input
                                        type="number" className="form-control"
                                        min="0"
                                        value={formData.intervalo_km}
                                        onChange={e => setFormData({
                                            ...formData,
                                            intervalo_km: e.target.value === '' ? '' : Number(e.target.value)
                                        })}
                                        required
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Intervalo Meses</label>
                                    <input
                                        type="number" className="form-control"
                                        min="0"
                                        placeholder="0 = Sin fecha"
                                        value={formData.intervalo_meses}
                                        onChange={e => setFormData({
                                            ...formData,
                                            intervalo_meses: e.target.value === '' ? '' : Number(e.target.value)
                                        })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3 form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="consumoSistematico"
                                    checked={formData.consumo_sistematico}
                                    onChange={e => setFormData({ ...formData, consumo_sistematico: e.target.checked })}
                                />
                                <label className="form-check-label fw-bold" htmlFor="consumoSistematico">
                                    ¿Lleva repuestos o sistemáticos?
                                </label>
                                <small className="text-muted d-block mt-1">
                                    Si se activa, se habilitará el buscador de stock al registrar el servicio.
                                </small>
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
