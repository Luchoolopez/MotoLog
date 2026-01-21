import { useState, useEffect } from "react";
import { WarehouseService } from "../../../services/warehouse.service";

interface Props {
    show: boolean;
    onClose: () => void;
    itemId: number | null;
    itemName: string;
}

interface UsageRecord {
    id: number;
    type: 'PURCHASE' | 'CONSUMPTION';
    date: string;
    quantity: number;
    detail: string;
    moto?: string;
    km?: number;
    price?: number;
}

export const ItemUsageHistoryModal = ({ show, onClose, itemId, itemName }: Props) => {
    const [history, setHistory] = useState<UsageRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && itemId) {
            const fetchHistory = async () => {
                setLoading(true);
                try {
                    // Fetch global history (all batches of the same item)
                    const data = await WarehouseService.getItemHistory(itemId, true);
                    setHistory(data);
                } catch (error) {
                    console.error("Error fetching item history", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        }
    }, [show, itemId]);

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">🕓 Historial General: {itemName}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <p className="mb-0 fs-5">No hay movimientos registrados.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light sticky-top">
                                        <tr>
                                            <th className="ps-3">Fecha</th>
                                            <th className="d-none d-md-table-cell">Evento</th>
                                            <th>Detalle / Moto</th>
                                            <th className="text-center">Cambio</th>
                                            <th className="text-end pe-3">Info</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((record, idx) => (
                                            <tr key={`${record.type}-${record.id}-${idx}`}>
                                                <td className="ps-3 text-nowrap">
                                                    {new Date(record.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                                                </td>
                                                <td className="d-none d-md-table-cell">
                                                    <span className={`badge ${record.type === 'PURCHASE' ? 'bg-success' : 'bg-danger'}`}>
                                                        {record.type === 'PURCHASE' ? 'ENTRADA' : 'SALIDA'}
                                                    </span>
                                                </td>
                                                <td style={{ maxWidth: '120px' }}>
                                                    <div className="fw-bold small text-truncate" title={record.detail}>{record.detail}</div>
                                                    {record.moto && <small className="text-muted d-block text-truncate" title={record.moto}>{record.moto}</small>}
                                                </td>
                                                <td className="text-center">
                                                    <span className={`fw-bold ${record.quantity > 0 ? 'text-success' : 'text-danger'}`}>
                                                        {record.quantity > 0 ? `+${record.quantity}` : record.quantity}
                                                    </span>
                                                </td>
                                                <td className="text-end text-muted small pe-3 text-nowrap">
                                                    {record.price ? `$${record.price.toLocaleString()}` :
                                                        record.km ? `${record.km.toLocaleString()} km` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer bg-light">
                        <div className="me-auto small text-muted">
                            * El historial incluye todas las compras y usos de este repuesto.
                        </div>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
