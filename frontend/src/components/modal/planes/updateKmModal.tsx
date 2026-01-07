import React, { useState } from "react";
import { MotoService } from "../../../services/moto.service";
import { useToast } from "../../../context/ToastContext";

interface Props {
    show: boolean;
    onClose: () => void;
    motoId: number;
    currentKm: number;
    onSuccess: () => void;
}

export const UpdateKmModal = ({ show, onClose, motoId, currentKm, onSuccess }: Props) => {
    const [km, setKm] = useState<number | string>(currentKm);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Removed restriction to allow corrections
        // if (Number(km) <= currentKm) { ... }

        try {
            setLoading(true);
            // Assuming we will update the service to accept date, or just pass it for future proofing
            // For now, let's keep the service call as is or update it if we modify the backend
            // The user asked for the date input, so we definitely send it.
            await MotoService.updateMileage(motoId, Number(km), fecha);
            // Note: If backend doesn't support date yet, we might need to update that first. 
            // But let's fix the UI first as per request.
            showToast('Kilometraje actualizado', 'success');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Error al actualizar kilometraje";
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Actualizar Odómetro</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Fecha de Lectura</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    max={new Date().toISOString().split('T')[0]}
                                    value={fecha}
                                    onChange={e => setFecha(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nuevo kilometraje</label>
                                <input
                                    type="number"
                                    className="form-control form-control-lg text-center"
                                    value={km}
                                    min="0"
                                    onChange={e => setKm(e.target.value === '' ? '' : Number(e.target.value))}
                                    autoFocus
                                    required
                                />
                            </div>
                            <small className="text-muted d-block text-center mt-2">
                                Actual: {currentKm.toLocaleString()} km
                            </small>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
