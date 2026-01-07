import { useEffect, useState } from 'react';
import { OdometerHistoryService, type OdometerRecord } from '../../../services/odometerHistory.service';

interface Props {
    show: boolean;
    onClose: () => void;
    motoId: number;
}

export const OdometerHistoryModal = ({ show, onClose, motoId }: Props) => {
    const [history, setHistory] = useState<OdometerRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedYears, setExpandedYears] = useState<number[]>([]);

    useEffect(() => {
        if (show && motoId) {
            fetchHistory();
        }
    }, [show, motoId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await OdometerHistoryService.getByMotoId(motoId);
            setHistory(data);

            // Auto expand current year
            const currentYear = new Date().getFullYear();
            setExpandedYears([currentYear]);
        } catch (error) {
            console.error('Error fetching odometer history:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleYear = (year: number) => {
        setExpandedYears(prev =>
            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
        );
    };

    if (!show) return null;

    // Group history by year
    const groupedHistory = history.reduce((acc: { [year: number]: OdometerRecord[] }, record) => {
        const year = new Date(record.fecha).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(record);
        return acc;
    }, {});

    const years = Object.keys(groupedHistory).map(Number).sort((a, b) => b - a);

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">📈 Historial de Kilometraje</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="alert alert-info text-center">
                                No hay registros de kilometraje disponibles.
                            </div>
                        ) : (
                            <div className="accordion" id="odometerAccordion">
                                {years.map((year) => (
                                    <div className="accordion-item mb-2 border rounded shadow-sm" key={year}>
                                        <h2 className="accordion-header">
                                            <button
                                                className={`accordion-button ${!expandedYears.includes(year) ? 'collapsed' : ''} bg-light py-2`}
                                                type="button"
                                                onClick={() => toggleYear(year)}
                                                style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                                            >
                                                📅 {year}
                                            </button>
                                        </h2>
                                        <div className={`accordion-collapse collapse ${expandedYears.includes(year) ? 'show' : ''}`}>
                                            <div className="accordion-body p-0">
                                                <div className="table-responsive">
                                                    <table className="table table-hover align-middle mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Fecha</th>
                                                                <th className="text-end">Kilometraje</th>
                                                                <th>Nota</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {groupedHistory[year].map((record) => (
                                                                <tr key={record.id}>
                                                                    <td>{new Date(record.fecha).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                                                                    <td className="text-end fw-bold">{record.km.toLocaleString()} km</td>
                                                                    <td className="text-muted small">
                                                                        {record.observaciones || '-'}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
