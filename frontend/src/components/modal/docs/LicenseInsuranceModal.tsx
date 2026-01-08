import React, { useState, useEffect } from "react";
import { MotoService } from "../../../services/moto.service";
import { LicenseInsuranceService, type CreateLicenseInsuranceDto, type LicenseInsurance } from "../../../services/licenseInsurance.service";
import type { Motorcycle } from "../../../types/moto.types";
import { useToast } from "../../../context/ToastContext";

interface Props {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: LicenseInsurance | null;
}

export const LicenseInsuranceModal = ({ show, onClose, onSuccess, initialData }: Props) => {
    const [formData, setFormData] = useState<CreateLicenseInsuranceDto>({
        moto_id: 0,
        tipo: 'Patente',
        entidad: '',
        nro_documento: '',
        fecha_vencimiento: new Date().toISOString().split('T')[0],
        monto: 0,
        observaciones: ''
    });

    const [motos, setMotos] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchMotos = async () => {
            try {
                const data = await MotoService.getAll();
                setMotos(data);
                if (data.length > 0 && !initialData) {
                    setFormData(prev => ({ ...prev, moto_id: data[0].id }));
                }
            } catch (error) {
                console.error("Error fetching motos", error);
            }
        };

        if (show) {
            fetchMotos();
            if (initialData) {
                setFormData({
                    moto_id: initialData.moto_id,
                    tipo: initialData.tipo,
                    entidad: initialData.entidad,
                    nro_documento: initialData.nro_documento,
                    fecha_vencimiento: initialData.fecha_vencimiento.split('T')[0],
                    monto: initialData.monto,
                    observaciones: initialData.observaciones || ''
                });
            } else {
                setFormData({
                    moto_id: motos[0]?.id || 0,
                    tipo: 'Patente',
                    entidad: '',
                    nro_documento: '',
                    fecha_vencimiento: new Date().toISOString().split('T')[0],
                    monto: 0,
                    observaciones: ''
                });
            }
        }
    }, [show, initialData]);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await LicenseInsuranceService.update(initialData.id, formData);
                showToast('Documento actualizado', 'success');
            } else {
                await LicenseInsuranceService.create(formData);
                showToast('Documento registrado', 'success');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            showToast(error.message || 'Error al guardar', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block px-2" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                    <div className="modal-header bg-dark text-white" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <h5 className="modal-title">
                            {initialData ? '📝 Editar Documento' : '📄 Nuevo Documento'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Moto</label>
                                    <select
                                        className="form-select"
                                        value={formData.moto_id}
                                        onChange={e => setFormData({ ...formData, moto_id: Number(e.target.value) })}
                                        required
                                        disabled={!!initialData}
                                    >
                                        <option value="">Seleccionar Moto</option>
                                        {motos.map(moto => (
                                            <option key={moto.id} value={moto.id}>
                                                {moto.marca} {moto.modelo} ({moto.patente})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Tipo</label>
                                    <select
                                        className="form-select"
                                        value={formData.tipo}
                                        onChange={e => setFormData({ ...formData, tipo: e.target.value as any })}
                                    >
                                        <option value="Patente">Patente</option>
                                        <option value="Seguro">Seguro</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Entidad / Compañía</label>
                                    <input
                                        type="text" className="form-control"
                                        value={formData.entidad}
                                        onChange={e => setFormData({ ...formData, entidad: e.target.value })}
                                        placeholder="Ej: AGIP, La Caja, Rivadavia..."
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Nro Documento / Póliza</label>
                                    <input
                                        type="text" className="form-control"
                                        value={formData.nro_documento}
                                        onChange={e => setFormData({ ...formData, nro_documento: e.target.value })}
                                        placeholder="Nro de póliza o partida..."
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Vencimiento</label>
                                    <input
                                        type="date" className="form-control"
                                        value={formData.fecha_vencimiento}
                                        onChange={e => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Monto / Cuota</label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                            type="number" className="form-control"
                                            value={formData.monto}
                                            onChange={e => setFormData({ ...formData, monto: Number(e.target.value) })}
                                            min="0" step="0.01" required
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Observaciones</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        value={formData.observaciones}
                                        onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                                        placeholder="Detalles adicionales..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bg-light" style={{ borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Documento'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
