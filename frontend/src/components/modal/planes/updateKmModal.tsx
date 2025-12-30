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
    const [km, setKm] = useState(currentKm);
    const [loading, setLoading] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (km < currentKm) return alert("El nuevo kilometraje no puede ser menor al actual");

        try {
            setLoading(true);
            await MotoService.updateKm(motoId, km);
            if(onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar KM");
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
                            <label className="form-label">Kilometraje Actual</label>
                            <input 
                                type="number" 
                                className="form-control form-control-lg text-center" 
                                value={km} 
                                onChange={e => setKm(Number(e.target.value))}
                                autoFocus
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};