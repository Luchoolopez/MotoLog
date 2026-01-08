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

    const handleTogglePagado = async (record: LicenseInsurance) => {
        try {
            // Optimistic update
            setRecords(prev => prev.map(r =>
                r.id === record.id ? { ...r, pagado: !r.pagado } : r
            ));

            await LicenseInsuranceService.update(record.id, { pagado: !record.pagado });
            showToast('Estado actualizado', 'success');
        } catch (error) {
            showToast('Error al actualizar', 'error');
            // Revert on error
            fetchRecords();
        }
    };

    const getStatusBadge = (dateStr: string, pagado: boolean) => {
        // Si está pagado, siempre está "AL DÍA"
        if (pagado) {
            return <span className="badge bg-success">AL DÍA</span>;
        }

        // Si no está pagado, verificar la fecha
        const vencimiento = new Date(dateStr);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        vencimiento.setHours(0, 0, 0, 0);

        const diffTime = vencimiento.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return <span className="badge bg-danger">VENCIDO</span>;
        if (diffDays <= 15) return <span className="badge bg-warning text-dark">PRÓXIMO A VENCER</span>;
        return <span className="badge bg-success">AL DÍA</span>;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-AR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Separate records by type
    const patentes = records.filter(r => r.tipo === 'Patente');
    const seguros = records.filter(r => r.tipo === 'Seguro');

    return (
        <div className="container-fluid mt-4 pb-5 px-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">📄 Patentes y Seguros</h2>
                    <p className="text-muted mb-0">Gestiona el vencimiento de tus documentos</p>
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
                <>
                    {/* PATENTES SECTION */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 text-primary">🚗 PATENTES</h4>
                        {patentes.length === 0 ? (
                            <div className="alert alert-info">No hay patentes registradas</div>
                        ) : (
                            <div className="table-responsive shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                                <table className="table table-hover mb-0" style={{ backgroundColor: 'white' }}>
                                    <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                        <tr>
                                            <th className="py-3 px-3" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dominio</th>
                                            <th className="py-3 px-3" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cuota</th>
                                            <th className="py-3 px-3 text-end" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Monto a Pagar</th>
                                            <th className="py-3 px-3" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Fecha Vencimiento</th>
                                            <th className="py-3 px-3 text-center" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Pagado</th>
                                            <th className="py-3 px-3 text-center" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                            <th className="py-3 px-3 text-center" style={{ fontWeight: 600, fontSize: '0.9rem', width: '100px' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patentes.map((record, index) => (
                                            <tr
                                                key={record.id}
                                                style={{
                                                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                                                    borderBottom: '1px solid #e9ecef'
                                                }}
                                            >
                                                <td className="py-3 px-3 align-middle" style={{ fontSize: '0.95rem' }}>
                                                    <div className="fw-medium">{record.moto?.patente || '-'}</div>
                                                    <small className="text-muted">{record.moto?.marca} {record.moto?.modelo}</small>
                                                </td>
                                                <td className="py-3 px-3 align-middle" style={{ fontSize: '0.95rem' }}>
                                                    {record.cuota || '-'}
                                                </td>
                                                <td className="py-3 px-3 align-middle text-end fw-bold" style={{ fontSize: '0.95rem', color: '#198754' }}>
                                                    ${record.monto.toLocaleString('es-AR')}
                                                </td>
                                                <td className="py-3 px-3 align-middle" style={{ fontSize: '0.95rem' }}>
                                                    {formatDate(record.fecha_vencimiento)}
                                                </td>
                                                <td className="py-3 px-3 align-middle text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                                        checked={record.pagado}
                                                        onChange={() => handleTogglePagado(record)}
                                                    />
                                                </td>
                                                <td className="py-3 px-3 align-middle text-center">
                                                    {getStatusBadge(record.fecha_vencimiento, record.pagado)}
                                                </td>
                                                <td className="py-3 px-3 align-middle text-center">
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => {
                                                                setSelectedRecord(record);
                                                                setShowModal(true);
                                                            }}
                                                            title="Editar"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(record.id)}
                                                            title="Eliminar"
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

                    {/* SEGUROS SECTION */}
                    <div className="mb-4">
                        <h4 className="fw-bold mb-3 text-primary">🛡️ SEGUROS</h4>
                        {seguros.length === 0 ? (
                            <div className="alert alert-info">No hay seguros registrados</div>
                        ) : (
                            <div className="table-responsive shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                                <table className="table table-hover mb-0" style={{ backgroundColor: 'white' }}>
                                    <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                        <tr>
                                            <th className="py-3 px-3" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Fecha Vencimiento</th>
                                            <th className="py-3 px-3" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Aseguradora</th>
                                            <th className="py-3 px-3" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Vehículo</th>
                                            <th className="py-3 px-3 text-end" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Monto</th>
                                            <th className="py-3 px-3" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cobertura</th>
                                            <th className="py-3 px-3 text-center" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Estado</th>
                                            <th className="py-3 px-3 text-center" style={{ fontWeight: 600, fontSize: '0.9rem', width: '100px' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {seguros.map((record, index) => (
                                            <tr
                                                key={record.id}
                                                style={{
                                                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                                                    borderBottom: '1px solid #e9ecef'
                                                }}
                                            >
                                                <td className="py-3 px-3 align-middle" style={{ fontSize: '0.95rem' }}>
                                                    {formatDate(record.fecha_vencimiento)}
                                                </td>
                                                <td className="py-3 px-3 align-middle" style={{ fontSize: '0.95rem' }}>
                                                    {record.entidad}
                                                </td>
                                                <td className="py-3 px-3 align-middle" style={{ fontSize: '0.95rem' }}>
                                                    <div className="fw-medium">{record.moto?.marca} {record.moto?.modelo}</div>
                                                    <small className="text-muted">{record.moto?.patente}</small>
                                                </td>
                                                <td className="py-3 px-3 align-middle text-end fw-bold" style={{ fontSize: '0.95rem', color: '#198754' }}>
                                                    ${record.monto.toLocaleString('es-AR')}
                                                </td>
                                                <td className="py-3 px-3 align-middle" style={{ fontSize: '0.95rem' }}>
                                                    {record.cobertura || '-'}
                                                </td>
                                                <td className="py-3 px-3 align-middle text-center">
                                                    {getStatusBadge(record.fecha_vencimiento, record.pagado)}
                                                </td>
                                                <td className="py-3 px-3 align-middle text-center">
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => {
                                                                setSelectedRecord(record);
                                                                setShowModal(true);
                                                            }}
                                                            title="Editar"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(record.id)}
                                                            title="Eliminar"
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

            <LicenseInsuranceModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchRecords}
                initialData={selectedRecord}
            />
        </div>
    );
};
