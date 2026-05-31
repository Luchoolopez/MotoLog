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
    const [tripDistance, setTripDistance] = useState<number | ''>('');
    const [estimatedPrice, setEstimatedPrice] = useState<number | ''>('');

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
            const latestRecord = data.history[0];
            setEstimatedPrice(latestRecord ? Number(latestRecord.precio_por_litro) : '');
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

    const estimatedLiters = avgConsumption && avgConsumption.kmPerLiter > 0 && Number(tripDistance) > 0
        ? Number(tripDistance) / avgConsumption.kmPerLiter
        : 0;

    const estimatedCost = estimatedLiters > 0 && Number(estimatedPrice) > 0
        ? estimatedLiters * Number(estimatedPrice)
        : 0;

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">⛽ Historial de Combustible</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body d-flex flex-column" style={{ height: '70vh', padding: 0 }}>
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Stats Section - Fixed at top */}
                                <div className="p-3 bg-light border-bottom">
                                    <div className="row">
                                        <div className="col-md-6 mb-2 mb-md-0">
                                            <div className="card bg-success text-white text-center p-3 shadow-sm h-100">
                                                <small className="text-white-50">Consumo Promedio</small>
                                                <h2 className="mb-0">{avgConsumption && avgConsumption.kmPerLiter > 0 ? `${avgConsumption.kmPerLiter.toFixed(2)} km/l` : '---'}</h2>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card bg-info text-dark text-center p-3 shadow-sm h-100">
                                                <small className="text-dark-50">Consumo Promedio</small>
                                                <h2 className="mb-0">{avgConsumption && avgConsumption.litersPer100Km > 0 ? `${avgConsumption.litersPer100Km.toFixed(2)} L/100km` : '---'}</h2>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <div className="card bg-secondary text-white text-center p-3 shadow-sm h-100">
                                                <small className="text-white-50">KM Recorridos</small>
                                                <h4 className="mb-0">
                                                    {history.length > 1
                                                        ? (Math.max(...history.map(h => h.km_momento)) - Math.min(...history.map(h => h.km_momento))).toLocaleString()
                                                        : '0'} km
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <div className="card bg-dark text-white text-center p-3 shadow-sm h-100">
                                                <small className="text-white-50">Total Litros</small>
                                                <h4 className="mb-0">
                                                    {history.reduce((acc, curr) => acc + Number(curr.litros), 0).toFixed(1)} L
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card bg-primary text-white text-center p-3 shadow-sm h-100">
                                                <small className="text-white-50">Gasto Total</small>
                                                <h4 className="mb-0">
                                                    ${history.reduce((acc, curr) => acc + Number(curr.total), 0).toLocaleString()}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card border-0 shadow-sm mt-3">
                                        <div className="card-body">
                                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
                                                <div>
                                                    <h6 className="mb-1 fw-bold">Calculadora de viaje</h6>
                                                    <small className="text-muted">Estimacion basada en el consumo promedio registrado</small>
                                                </div>
                                                {(!avgConsumption || avgConsumption.kmPerLiter <= 0) && (
                                                    <span className="badge bg-warning text-dark">Faltan cargas suficientes</span>
                                                )}
                                            </div>

                                            <div className="row g-3 align-items-end">
                                                <div className="col-md-4">
                                                    <label className="form-label small text-muted">Distancia a recorrer</label>
                                                    <div className="input-group">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            className="form-control"
                                                            value={tripDistance}
                                                            onChange={(e) => setTripDistance(e.target.value === '' ? '' : Number(e.target.value))}
                                                            placeholder="Ej: 250"
                                                        />
                                                        <span className="input-group-text">km</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small text-muted">Precio por litro</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">$</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="form-control"
                                                            value={estimatedPrice}
                                                            onChange={(e) => setEstimatedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                                            placeholder="Precio actual"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="rounded bg-dark text-white p-3 h-100">
                                                        <div className="d-flex justify-content-between gap-2">
                                                            <small className="text-white-50">Litros</small>
                                                            <strong>{estimatedLiters > 0 ? `${estimatedLiters.toFixed(2)} L` : '--'}</strong>
                                                        </div>
                                                        <div className="d-flex justify-content-between gap-2 mt-2">
                                                            <small className="text-white-50">Costo</small>
                                                            <strong className="text-success">
                                                                {estimatedCost > 0 ? `$${estimatedCost.toLocaleString('es-AR', { maximumFractionDigits: 0 })}` : '--'}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Section - Scrollable */}
                                <div className="flex-grow-1 overflow-auto p-3">
                                    {history.length === 0 ? (
                                        <div className="alert alert-info text-center">
                                            No hay registros de combustible disponibles.
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead className="table-light sticky-top" style={{ top: 0, zIndex: 1 }}>
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
                                </div>
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
