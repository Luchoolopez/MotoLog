import React, { useState, useEffect } from "react";
import { MotoService } from "../../../services/moto.service";
import { MaintenanceHistoryService } from "../../../services/maintenanceHistory.service";
import { type WarehouseItem } from "../../../services/warehouse.service";
import type { Motorcycle } from "../../../types/moto.types";
import { useToast } from "../../../context/ToastContext";

interface Props {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: WarehouseItem | null;
}

export const InstallItemModal = ({ show, onClose, onSuccess, item }: Props) => {
    const [motos, setMotos] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        moto_id: 0,
        fecha_realizado: new Date().toISOString().split('T')[0],
        km_realizado: 0,
        cantidad_usada: 1,
        observaciones: ''
    });

    useEffect(() => {
        const fetchMotos = async () => {
            try {
                const data = await MotoService.getAll();
                setMotos(data);
                if (data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        moto_id: data[0].id,
                        km_realizado: data[0].km_actual
                    }));
                }
            } catch (error) {
                console.error("Error fetching motos", error);
            }
        };

        if (show) {
            fetchMotos();
            setFormData(prev => ({ ...prev, cantidad_usada: 1 }));
        }
    }, [show, item]);

    const handleMotoChange = (motoId: number) => {
        const selectedMoto = motos.find(m => m.id === motoId);
        setFormData({
            ...formData,
            moto_id: motoId,
            km_realizado: selectedMoto?.km_actual || 0
        });
    }

    if (!show || !item) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const historyDto = {
                moto_id: formData.moto_id,
                item_plan_id: null, // Marcar como ad-hoc
                tarea_ad_hoc: `Instalación: ${item.nombre}`,
                fecha_realizado: formData.fecha_realizado,
                km_realizado: formData.km_realizado,
                observaciones: formData.observaciones || `Instalación de repuesto desde almacén (Nro Parte: ${item.nro_parte || 'N/A'})`,
                consumed_items: [
                    {
                        warehouse_item_id: item.id,
                        cantidad_usada: formData.cantidad_usada
                    }
                ]
            };

            await MaintenanceHistoryService.create(historyDto);
            showToast(`${item.nombre} instalado correctamente`, 'success');
            onSuccess();
            onClose();
        } catch (error: any) {
            showToast(error.message || 'Error al registrar la instalación', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block px-2" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                    <div className="modal-header bg-primary text-white" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <h5 className="modal-title">
                            🛠️ Instalar Repuesto
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="mb-3 p-3 bg-light rounded text-center">
                                <span className="text-muted d-block small">REPUESTO A COLOCAR</span>
                                <h4 className="mb-0 fw-bold">{item.nombre}</h4>
                                {item.nro_parte && <small className="text-muted">{item.nro_parte}</small>}
                                <div className="mt-2">
                                    <span className="badge bg-info">Stock Disponible: {item.cantidad}</span>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Moto Destino</label>
                                    <select
                                        className="form-select"
                                        value={formData.moto_id}
                                        onChange={e => handleMotoChange(Number(e.target.value))}
                                        required
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
                                    <label className="form-label fw-bold">Fecha de Instalación</label>
                                    <input
                                        type="date" className="form-control"
                                        value={formData.fecha_realizado}
                                        onChange={e => setFormData({ ...formData, fecha_realizado: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Kilómetros actuales</label>
                                    <input
                                        type="number" className="form-control"
                                        value={formData.km_realizado}
                                        onChange={e => setFormData({ ...formData, km_realizado: Number(e.target.value) })}
                                        min="0" required
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Cantidad a usar</label>
                                    <input
                                        type="number" className="form-control"
                                        value={formData.cantidad_usada}
                                        onChange={e => setFormData({ ...formData, cantidad_usada: Number(e.target.value) })}
                                        min="1" max={item.cantidad} required
                                    />
                                    <small className="text-muted">Se descontará del stock del almacén.</small>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Notas adicionales</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        value={formData.observaciones}
                                        onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                                        placeholder="Puse un precinto extra, ajusté tal tornillo..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bg-light" style={{ borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary px-4" disabled={loading || formData.cantidad_usada > item.cantidad}>
                                {loading ? 'Instalando...' : 'Confirmar Instalación'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
