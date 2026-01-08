import React, { useEffect, useState } from 'react';
import { MaintenanceHistoryService } from '../../../services/maintenanceHistory.service';

interface Props {
    show: boolean;
    onClose: () => void;
    motoId: number;
    itemId?: number | null; // Optional for global history
    taskName?: string;
}

export const HistoryListModal = ({ show, onClose, motoId, itemId, taskName }: Props) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && motoId) {
            fetchHistory();
        }
    }, [show, motoId, itemId]); // Re-fetch if itemId changes

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const allHistory = await MaintenanceHistoryService.getByMotoId(motoId);

            // If itemId is provided, filter. Otherwise show all.
            let displayHistory = allHistory;
            if (itemId) {
                displayHistory = allHistory.filter((h: any) => Number(h.item_plan_id) === Number(itemId));
            }

            setHistory(displayHistory);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    const isGlobal = !itemId;
    const title = isGlobal ? 'Historial Completo' : `Historial: ${taskName}`;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="alert alert-info text-center">
                                No hay registros históricos disponibles.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            {isGlobal && <th>Tarea</th>}
                                            <th>Kilometraje</th>
                                            <th>Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((record) => (
                                            <tr key={record.id}>
                                                <td>{new Date(record.fecha_realizado).toLocaleDateString()}</td>
                                                {isGlobal && <td><span className="badge bg-secondary">{record.detalle_tarea?.tarea || record.tarea_ad_hoc || 'Desconocido'}</span></td>}
                                                <td className="fw-bold">{record.km_realizado.toLocaleString()} km</td>
                                                <td className="text-muted small">
                                                    {record.observaciones || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
