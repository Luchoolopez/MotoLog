import React, { useState } from "react";
import { MotoService } from "../../../services/moto.service";

interface Props {
    show: boolean;
    onClose: () => void;
    motoId: number;
    currentKm: number;
    onSuccess: () => void;
}

export const UpdateKmModal = ({ show, onClose, motoId, currentKm, onSuccess }: Props) => {
    const [km, setKm] = useState<number>(currentKm);
    const [loading, setLoading] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (km <= currentKm) {
            return alert("El nuevo kilometraje debe ser mayor al actual");
        }

        try {
            setLoading(true);
            await MotoService.updateMileage(motoId, km);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar kilometraje");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Actualizar Odómetro</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <label className="form-label">Nuevo kilometraje</label>
                            <input
                                type="number"
                                className="form-control form-control-lg text-center"
                                value={km}
                                min={currentKm + 1}
                                onChange={e => setKm(Number(e.target.value))}
                                autoFocus
                                required
                            />
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
