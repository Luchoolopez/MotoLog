import React, { useState } from "react";
import { PlanService } from "../../../services/planService.service";
import type { CreatePlanDto } from "../../../types/maintenancePlan";

interface Props {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const PlanFormModal = ({ show, onClose, onSuccess }: Props) => {
    const [formdata, setFormData] = useState<CreatePlanDto>({ nombre: '', descripcion: '' });
    const [loading, setloading] = useState(false);

    if (!show) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formdata.nombre.trim()) {
            return alert('El nombre es obligatorio');
        }

        try {
            setloading(true);
            await PlanService.create(formdata);
            setFormData({ nombre: '', descripcion: '' });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error al crear el plan');
        } finally {
            setloading(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nuevo Plan de Mantenimiento</h5>
                        <button type="button" className="btn-close" onClick={onClose}>X</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <label className="form-label">Nombre del Plan</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ej: Plan Yamaha FZ"
                                autoFocus
                                value={formdata.nombre}
                                onChange={e => setFormData({ ...formdata, nombre: e.target.value })}
                            />

                            <div className="mb-3">
                                <label className="form-label">Descripcion</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Detalles opcionales..."
                                    value={formdata.descripcion}
                                    onChange={e => setFormData({ ...formdata, descripcion: e.target.value })}
                                />
                            </div>
                        </div>


                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar plan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}