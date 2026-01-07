import React, { useState } from "react";
import type { CreateHistoryDto } from "../../../services/maintenanceHistory.service";

interface Props {
    show: boolean;
    onClose: () => void;
    motoId: number;
    itemId: number;
    taskName: string;
    currentKm: number;
    onSubmit: (data: CreateHistoryDto) => Promise<boolean>;
    onSuccess: () => void;
}

export const RegisterServiceModal = ({ show, onClose, motoId, itemId, taskName, currentKm, onSubmit, onSuccess }: Props) => {
    const [formData, setFormData] = useState({
        fecha_realizado: new Date().toISOString().split('T')[0],
        km_realizado: currentKm as string | number,
        observaciones: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newRecord: CreateHistoryDto = {
            moto_id: motoId,
            item_plan_id: itemId,
            fecha_realizado: formData.fecha_realizado,
            km_realizado: Number(formData.km_realizado),
            observaciones: formData.observaciones
        };

        const success = await onSubmit(newRecord);
        setIsSubmitting(false);

        if (success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Registrar Service: {taskName}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Fecha Realizado</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    max={new Date().toISOString().split('T')[0]}
                                    value={formData.fecha_realizado}
                                    onChange={e => setFormData({ ...formData, fecha_realizado: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Kilometraje Realizado</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    value={formData.km_realizado}
                                    onChange={e => setFormData({
                                        ...formData,
                                        km_realizado: e.target.value === '' ? '' : Number(e.target.value)
                                    })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Observaciones (Opcional)</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    value={formData.observaciones}
                                    onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Registrando...' : 'Confirmar Registro'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
