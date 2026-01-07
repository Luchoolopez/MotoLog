import { useEffect, useState } from 'react';
import { FuelService, type FuelRecord, type FuelHistoryResponse } from '../../../services/fuel.service';
import { FuelFormModal } from './FuelFormModal';

interface Props {
    show: boolean;
    onClose: () => void;
    motoId: number;
    onSuccess?: () => void; // Optional callback for parent refresh
}

export const FuelHistoryModal = ({ show, onClose, motoId, onSuccess }: Props) => {
    const [history, setHistory] = useState<FuelRecord[]>([]);
    const [avgConsumption, setAvgConsumption] = useState<FuelHistoryResponse['averageConsumption'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<FuelRecord | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (show && motoId) {
            fetchHistory();
        }
    }, [show, motoId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await FuelService.getByMotoId(motoId);
            setHistory(data.history);
            setAvgConsumption(data.averageConsumption);
        } catch (error) {
            console.error('Error fetching fuel history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
            try {
                await FuelService.delete(id);
                fetchHistory();
                if (onSuccess) onSuccess(); // Notify dashboard
            } catch (error) {
                console.error('Error deleting fuel record:', error);
            }
        }
    };

    const handleEdit = (record: FuelRecord) => {
        setSelectedRecord(record);
        setShowEditModal(true);
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">⛽ Historial de Combustible</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="row mb-4">
                                    <div className="col-md-6 mb-2">
                                        <div className="card bg-success text-white text-center p-3 shadow-sm h-100">
                                            <small className="text-white-50">Consumo Promedio</small>
                                            <h2 className="mb-0">{avgConsumption && avgConsumption.kmPerLiter > 0 ? `${avgConsumption.kmPerLiter.toFixed(2)} km/l` : '---'}</h2>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="card bg-info text-dark text-center p-3 shadow-sm h-100">
                                            <small className="text-dark-50">Consumo Promedio</small>
                                            <h2 className="mb-0">{avgConsumption && avgConsumption.litersPer100Km > 0 ? `${avgConsumption.litersPer100Km.toFixed(2)} L/100km` : '---'}</h2>
                                        </div>
                                    </div>
                                </div>

                                {history.length === 0 ? (
                                    <div className="alert alert-info text-center">
                                        No hay registros de combustible disponibles.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>KM</th>
                                                    <th>Litros</th>
                                                    <th>Precio</th>
                                                    <th>Total</th>
                                                    <th>Empresa</th>
                                                    <th className="text-center">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {history.map((record) => (
                                                    <tr key={record.id}>
                                                        <td>{new Date(record.fecha).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                                                        <td>{record.km_momento.toLocaleString()}</td>
                                                        <td className="fw-bold">{record.litros} L</td>
                                                        <td>${record.precio_por_litro}</td>
                                                        <td className="fw-bold text-success">${record.total.toLocaleString()}</td>
                                                        <td><span className="badge bg-secondary">{record.empresa}</span></td>
                                                        <td className="text-center">
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btn btn-sm btn-outline-info"
                                                                    onClick={() => handleEdit(record)}
                                                                >
                                                                    ✏️
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(record.id)}
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>

            {selectedRecord && (
                <FuelFormModal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    motoId={motoId}
                    currentKm={selectedRecord.km_momento}
                    initialData={selectedRecord}
                    onSuccess={() => {
                        fetchHistory();
                        if (onSuccess) onSuccess(); // Notify dashboard
                    }}
                />
            )}
        </div>
    );
};
