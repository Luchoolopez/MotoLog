import React, { useState } from "react";

interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<boolean>;
}

export const MotoFormModal = ({ show, onClose, onSubmit }: Props) => {
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        anio: new Date().getFullYear(),
        patente: '',
        km_actual: 0 as string | number,
        fecha_compra: new Date().toISOString().split('T')[0]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const success = await onSubmit({
            ...formData,
            km_actual: Number(formData.km_actual)
        });

        setIsSubmitting(false);

        if (success) {
            setFormData({ marca: '', modelo: '', anio: new Date().getFullYear(), patente: '', km_actual: 0, fecha_compra: '' });
            onClose();
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar Nueva Moto</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-2">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Marca</label>
                                    <input type="text" className="form-control" placeholder="Honda"
                                        value={formData.marca} onChange={e => setFormData({ ...formData, marca: e.target.value.toUpperCase() })} required />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Modelo</label>
                                    <input type="text" className="form-control" placeholder="XR 150"
                                        value={formData.modelo} onChange={e => setFormData({ ...formData, modelo: e.target.value.toUpperCase() })} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Año de Fabricación</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="2023"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        value={formData.anio}
                                        onChange={e => setFormData({ ...formData, anio: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Patente</label>
                                <input type="text" className="form-control" placeholder="A123XYZ"
                                    value={formData.patente} onChange={e => setFormData({ ...formData, patente: e.target.value.toUpperCase() })} />
                            </div>

                            <div className="row g-2">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Kilometraje</label>
                                    <input type="number" className="form-control"
                                        min="0"
                                        value={formData.km_actual}
                                        onChange={e => setFormData({
                                            ...formData,
                                            km_actual: e.target.value === '' ? '' : Number(e.target.value)
                                        })}
                                        required
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Fecha Compra</label>
                                    <input type="date" className="form-control"
                                        max={new Date().toISOString().split('T')[0]}
                                        value={formData.fecha_compra} onChange={e => setFormData({ ...formData, fecha_compra: e.target.value })} />

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar Moto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};