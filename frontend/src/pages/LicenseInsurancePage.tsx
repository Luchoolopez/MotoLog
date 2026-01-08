import { useEffect, useState } from 'react';
import { LicenseInsuranceService, type LicenseInsurance } from '../services/licenseInsurance.service';
import { LicenseInsuranceModal } from '../components/modal/docs/LicenseInsuranceModal';
import { useToast } from '../context/ToastContext';

export const LicenseInsurancePage = () => {
    const [records, setRecords] = useState<LicenseInsurance[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<LicenseInsurance | null>(null);
    const { showToast } = useToast();

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const data = await LicenseInsuranceService.getAll();
            setRecords(data);
        } catch (error) {
            console.error("Error fetching documents", error);
            showToast('Error al cargar documentos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este registro?')) {
            try {
                await LicenseInsuranceService.delete(id);
                showToast('Registro eliminado', 'success');
                fetchRecords();
            } catch (error) {
                showToast('Error al eliminar', 'error');
            }
        }
    };

    const getStatusBadge = (dateStr: string) => {
        const vencimiento = new Date(dateStr);
        const hoy = new Date();
        const diffTime = vencimiento.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return <span className="badge bg-danger">VENCIDO</span>;
        if (diffDays <= 7) return <span className="badge bg-warning text-dark">VENCE PRONTO ({diffDays}d)</span>;
        return <span className="badge bg-success">AL DÍA</span>;
    };

    return (
        <div className="container mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">📄 Patentes y Seguros</h2>
                    <p className="text-muted">Gestiona el vencimiento de tus documentos</p>
                </div>
                <button
                    className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => {
                        setSelectedRecord(null);
                        setShowModal(true);
                    }}
                >
                    <span className="fs-4">+</span> Nuevo Registro
                </button>
            </div>

            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Cargando documentos...</p>
                </div>
            ) : records.length === 0 ? (
                <div className="card border-0 shadow-sm p-5 text-center bg-light">
                    <div className="display-1 mb-3">📄</div>
                    <h3>No hay documentos registrados</h3>
                    <p className="text-muted">Empieza agregando tu seguro o patente.</p>
                </div>
            ) : (
                <div className="row g-3">
                    {records.map(record => (
                        <div key={record.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
                                    <span className="fw-bold">{record.tipo.toUpperCase()}</span>
                                    {getStatusBadge(record.fecha_vencimiento)}
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-primary mb-1">
                                        {record.moto?.marca} {record.moto?.modelo}
                                    </h5>
                                    <p className="text-muted small mb-3">Patente: {record.moto?.patente}</p>

                                    <div className="d-flex flex-column gap-2 mb-3">
                                        <div className="d-flex justify-content-between border-bottom pb-1">
                                            <span className="text-muted">Entidad:</span>
                                            <span className="fw-medium">{record.entidad}</span>
                                        </div>
                                        <div className="d-flex justify-content-between border-bottom pb-1">
                                            <span className="text-muted">Nro / Póliza:</span>
                                            <span className="fw-medium text-truncate ms-2">{record.nro_documento}</span>
                                        </div>
                                        <div className="d-flex justify-content-between border-bottom pb-1">
                                            <span className="text-muted">Vencimiento:</span>
                                            <span className="fw-bold">{new Date(record.fecha_vencimiento).toLocaleDateString()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between border-bottom pb-1">
                                            <span className="text-muted">Monto:</span>
                                            <span className="fw-bold text-success">${record.monto.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {record.observaciones && (
                                        <div className="bg-light p-2 rounded mb-3 small italic text-muted">
                                            "{record.observaciones}"
                                        </div>
                                    )}

                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-outline-secondary btn-sm flex-grow-1"
                                            onClick={() => {
                                                setSelectedRecord(record);
                                                setShowModal(true);
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(record.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <LicenseInsuranceModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchRecords}
                initialData={selectedRecord}
            />
        </div>
    );
};
