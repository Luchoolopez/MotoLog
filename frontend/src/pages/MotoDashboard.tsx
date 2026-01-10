import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MotoService } from '../services/moto.service';
import type { MaintenanceStatus, Motorcycle } from '../types/moto.types';
import { ItemFormModal } from '../components/modal/planes/itemFormModal';
import { UpdateKmModal } from '../components/modal/planes/updateKmModal';
import { RegisterServiceModal } from '../components/modal/planes/RegisterServiceModal';
import { HistoryListModal } from '../components/modal/planes/HistoryListModal';
import { OdometerHistoryModal } from '../components/modal/planes/OdometerHistoryModal';
import { FuelFormModal } from '../components/modal/planes/FuelFormModal';
import { FuelHistoryModal } from '../components/modal/planes/FuelHistoryModal';
import { MaintenanceHistoryService, type CreateHistoryDto } from '../services/maintenanceHistory.service';
import { FuelService, type FuelHistoryResponse } from '../services/fuel.service';
import { useItems } from '../hooks/useItem';
import { useToast } from '../context/ToastContext';

export const MotoDashboard = () => {
    const { id } = useParams();
    const motoId = Number(id);
    const { showToast } = useToast();

    const { addItem, deleteItem } = useItems();

    const [moto, setMoto] = useState<Motorcycle | null>(null);
    const [statuses, setStatuses] = useState<MaintenanceStatus[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para los modales
    const [showItemModal, setShowItemModal] = useState(false);
    const [showKmModal, setShowKmModal] = useState(false); // Estado para modal de KM
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showOdometerHistoryModal, setShowOdometerHistoryModal] = useState(false);
    const [showFuelFormModal, setShowFuelFormModal] = useState(false);
    const [showFuelHistoryModal, setShowFuelHistoryModal] = useState(false);
    const [averageConsumption, setAverageConsumption] = useState<FuelHistoryResponse['averageConsumption'] | null>(null);

    // Estado para el tooltip personalizado
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const [selectedItemForService, setSelectedItemForService] = useState<{ id: number, task: string } | null>(null);
    const [selectedItemForHistory, setSelectedItemForHistory] = useState<{ id: number, task: string } | null>(null);

    const fetchDashboard = async () => {
        try {
            // setLoading(true); // Opcional: comentar para que no parpadee al actualizar solo KM
            const [motoData, statusData, fuelData] = await Promise.all([
                MotoService.getById(motoId),
                MotoService.getStatus(motoId),
                FuelService.getByMotoId(motoId)
            ]);
            setMoto(motoData);
            setStatuses(statusData);
            setAverageConsumption(fuelData.averageConsumption);
        } catch (error) {
            console.error("Error cargando dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [motoId]);

    const handleRegisterService = async (data: CreateHistoryDto) => {
        try {
            await MaintenanceHistoryService.create(data);
            showToast('Servicio registrado con éxito', 'success');
            return true;
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || error.message;
            showToast('Error al registrar servicio: ' + msg, 'error');
            return false;
        }
    };

    const handleExportReport = async () => {
        if (!moto) return;

        try {
            const history = await MaintenanceHistoryService.getByMotoId(motoId);

            // Generar CSV
            // Usamos punto y coma (;) que es más compatible con Excel en español/Latinoamérica
            // Y agregamos el BOM (\uFEFF) para que reconozca los acentos (UTF-8)
            let csvContent = "data:text/csv;charset=utf-8,\uFEFF";

            // Sección 1: Estado del Plan
            csvContent += "ESTADO ACTUAL DEL PLAN DE MANTENIMIENTO\n";
            csvContent += "Tarea;Tipo;Estado;KM Limite;KM Restantes;Fecha Limite;Dias Restantes\n";

            statuses.forEach(item => {
                const tipo = item.tipo || '-';
                const estado = item.estado;
                const kmLimite = item.km_limite || '-';
                const kmRestantes = item.intervalo_km > 0 ? item.km_restantes : '-';
                const fechaLimite = item.fecha_limite || '-';
                const diasRestantes = item.intervalo_meses > 0 ? item.dias_restantes : '-';

                csvContent += `"${item.tarea}";"${tipo}";"${estado}";"${kmLimite}";"${kmRestantes}";"${fechaLimite}";"${diasRestantes}"\n`;
            });

            csvContent += "\n\nHISTORIAL DE SERVICIOS REALIZADOS\n";
            csvContent += "Fecha;KM;Tarea;Tipo Servicio;Observaciones\n";

            history.forEach((h: any) => {
                const fecha = new Date(h.fecha_realizado).toLocaleDateString();
                const tarea = h.detalle_tarea ? h.detalle_tarea.tarea : (h.tarea_ad_hoc || 'Tarea desconocida');
                const tipo = h.detalle_tarea ? h.detalle_tarea.tipo : 'Ad-hoc';
                const obs = h.observaciones ? h.observaciones.replace(/"/g, '""') : '';

                csvContent += `"${fecha}";"${h.km_realizado}";"${tarea}";"${tipo}";"${obs}"\n`;
            });

            // Descargar
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Reporte_Moto_${moto.patente}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Error exportando reporte", error);
            showToast("Error al generar el reporte", "error");
        }
    };

    if (loading || !moto) return <div className="p-5 text-center">Analizando moto... 🔧</div>;

    return (
        <div className="container-fluid flex-grow-1" style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/assets/garage-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            color: 'white'
        }}>
            <div className="sticky-top" style={{ top: '88px', zIndex: 900, backgroundColor: 'rgba(23, 23, 23, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', margin: '0 -12px' }}>
                <div className="container pt-4">
                    <div className="card bg-dark text-white mb-4 shadow">
                        <div className="card-body">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                <div className="w-100">
                                    <Link to="/" className="text-white-50 text-decoration-none mb-2 d-inline-block">← Volver al Garage</Link>
                                    <h2 className="mb-0 fs-3 fs-md-2">{moto.marca} {moto.modelo}</h2>
                                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                                        <span className="badge bg-light text-dark">{moto.patente}</span>
                                        {averageConsumption !== null && (
                                            <span className="badge bg-success" title={`Consumo: ${averageConsumption.kmPerLiter.toFixed(2)} km/l | ${averageConsumption.litersPer100Km.toFixed(2)} L/100km`}>
                                                ⛽ {averageConsumption.kmPerLiter.toFixed(1)} km/l | {averageConsumption.litersPer100Km.toFixed(1)} L/100km
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-md-end w-100 w-md-auto border-md-0 mt-2 mt-md-0">
                                    <div className="display-6 fs-2 fs-md-1 fw-bold">{moto.km_actual.toLocaleString()} <small className="fs-6 opacity-75">km</small></div>
                                    <div className="d-flex gap-2 justify-content-start justify-content-md-end mt-2">
                                        <button
                                            className="btn btn-sm btn-outline-light flex-grow-1 flex-md-grow-0"
                                            onClick={() => setShowOdometerHistoryModal(true)}
                                            title="Ver historial de kilómetros"
                                        >
                                            🕓 Historial
                                        </button>
                                        <button
                                            className="btn btn-sm btn-light flex-grow-1 flex-md-grow-0"
                                            onClick={() => setShowKmModal(true)} // Abrir modal KM
                                        >
                                            ✏️ Actualizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container pb-4 pt-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-3">
                    <h4 className="mb-0 fs-5 fs-md-4 fw-bold">Estado de Mantenimiento</h4>
                    <div className="d-flex gap-2 flex-wrap w-100 w-md-auto">
                        <button className="btn btn-outline-light btn-sm flex-grow-1" onClick={handleExportReport} title="Descargar reporte completo">
                            📥 Reporte
                        </button>
                        <button className="btn btn-outline-success btn-sm flex-grow-1" onClick={() => setShowFuelHistoryModal(true)}>
                            ⛽ Historial
                        </button>
                        <button className="btn btn-success btn-sm flex-grow-1" onClick={() => setShowFuelFormModal(true)}>
                            + Nafta
                        </button>
                        <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => setShowItemModal(true)}>
                            + Tarea
                        </button>
                    </div>
                </div>

                <div className="list-group shadow-sm">
                    {statuses.length === 0 && (
                        <div className="alert alert-info text-center">
                            <p className="mb-2">No hay reglas definidas.</p>
                        </div>
                    )}

                    {statuses.map((item) => {
                        // Icono basado en el TIPO de tarea
                        const getIcon = (t: string) => {
                            switch (t.trim()) {
                                case 'Inspección': return '👁️';
                                case 'Cambio': return '🛠️';
                                case 'Limpieza': return '🫧';
                                case 'Lubricación': return '🛢️';
                                case 'Ajuste': return '🔧';
                                default: return '🔧';
                            }
                        };

                        const types = item.tipo.split(',');
                        // const mainIcon = getIcon(types[0]); // Usar el primero como principal si se requiere uno solo

                        let borderClass = 'border-start border-5 border-success';
                        let bgClass = '';
                        let btnText = 'Registrar';
                        let btnClass = 'btn-outline-primary';
                        let textTitleClass = 'text-dark'; // Default for OK
                        let textDescClass = 'text-muted'; // Default for OK

                        if (item.estado === 'ALERTA') {
                            // icon = '🟡'; // Mantener icono de tipo
                            borderClass = 'border-start border-5 border-warning';
                            bgClass = 'bg-warning bg-opacity-10';
                            btnText = 'Registrar Pronto';
                            btnClass = 'btn-warning';
                            textTitleClass = 'text-white';
                            textDescClass = 'text-white-50';
                        } else if (item.estado === 'VENCIDO') {
                            // icon = '🔴'; // Mantener icono de tipo
                            borderClass = 'border-start border-5 border-danger';
                            bgClass = 'bg-danger bg-opacity-10';
                            btnText = '¡REGISTRAR YA!';
                            btnClass = 'btn-danger';
                            textTitleClass = 'text-white';
                            textDescClass = 'text-white-50';
                        }

                        return (
                            <div key={item.item_id} className={`list-group-item p-3 ${borderClass} ${bgClass} shadow-sm mb-2 rounded`}>
                                <div className="d-flex flex-column flex-md-row w-100 justify-content-between align-items-start align-items-md-center gap-3">
                                    <div className="w-100">
                                        <h5 className={`mb-1 d-flex align-items-center gap-2 fs-6 fs-md-5 ${textTitleClass}`}>
                                            <div
                                                className="position-relative d-inline-flex"
                                                onMouseEnter={() => setHoveredItem(item.item_id)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                style={{ cursor: 'help' }}
                                            >
                                                <span className="fs-4 d-flex gap-1" role="img" aria-label={item.tipo}>
                                                    {types.map((t, i) => (
                                                        <span key={i} title={t}>{getIcon(t)}</span>
                                                    ))}
                                                </span>

                                                {hoveredItem === item.item_id && (
                                                    <div
                                                        className="position-absolute start-50 bottom-100 mb-2 shadow-lg"
                                                        style={{
                                                            transform: 'translateX(-50%)',
                                                            backgroundColor: 'rgba(33, 37, 41, 0.95)',
                                                            color: 'white',
                                                            padding: '0.8rem 1rem',
                                                            borderRadius: '0.5rem',
                                                            width: 'max-content',
                                                            maxWidth: '220px',
                                                            zIndex: 1060,
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            backdropFilter: 'blur(4px)'
                                                        }}
                                                    >
                                                        <div className="text-center">
                                                            <div className="fw-bold mb-1 text-warning" style={{ fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Frecuencia</div>
                                                            <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                                                {item.intervalo_km > 0 && (
                                                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                                                        <span>🛣️</span>
                                                                        <span>{item.intervalo_km.toLocaleString()} km</span>
                                                                    </div>
                                                                )}
                                                                {item.intervalo_meses > 0 && (
                                                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                                                        <span>📅</span>
                                                                        <span>{item.intervalo_meses} meses</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Flechita abajo */}
                                                            <div
                                                                className="position-absolute top-100 start-50 translate-middle-x"
                                                                style={{
                                                                    borderLeft: '8px solid transparent',
                                                                    borderRight: '8px solid transparent',
                                                                    borderTop: '8px solid rgba(33, 37, 41, 0.95)'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                {item.tarea}
                                                <span className="badge bg-secondary ms-2" style={{ fontSize: '0.6em', opacity: 0.8 }}>{item.tipo}</span>
                                            </div>
                                        </h5>
                                        <div className={`small mt-1 ${textDescClass}`}>
                                            {item.estado === 'OK' ? (
                                                <span className="d-block d-md-inline">
                                                    {item.intervalo_km > 0 && (
                                                        <>Te quedan <strong>{item.km_restantes} km</strong></>
                                                    )}

                                                    {item.intervalo_meses > 0 && item.dias_restantes < 3650 && (
                                                        <span>
                                                            {item.intervalo_km > 0 ? " o " : "Te quedan "}
                                                            <strong>{item.dias_restantes} días</strong>
                                                        </span>
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="text-danger fw-bold d-block d-md-inline">
                                                    {item.intervalo_km > 0 && item.km_restantes < 0
                                                        ? `¡Te pasaste por ${Math.abs(item.km_restantes)} km!`
                                                        : (item.intervalo_meses > 0 && item.dias_restantes < 0)
                                                            ? `¡Vencido hace ${Math.abs(item.dias_restantes)} día${Math.abs(item.dias_restantes) === 1 ? '' : 's'}!`
                                                            : (item.intervalo_meses > 0)
                                                                ? `${item.intervalo_km > 0 ? `Faltan ${item.km_restantes} km o ` : 'Faltan '}${item.dias_restantes} días.`
                                                                : `Faltan ${item.km_restantes} km.`}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 align-items-center w-100 w-md-auto justify-content-end border-md-0 pt-md-0">
                                        <button
                                            className="btn btn-outline-info btn-sm px-3"
                                            title="Ver Historial"
                                            onClick={() => {
                                                setSelectedItemForHistory({ id: item.item_id, task: item.tarea });
                                                setShowHistoryModal(true);
                                            }}
                                        >
                                            Ver 👁️
                                        </button>

                                        <button className="btn btn-outline-danger btn-sm border-0"
                                            title="Borrar Tarea"
                                            onClick={async () => {
                                                if (confirm('¿Borrar regla?')) {
                                                    await deleteItem(item.item_id);
                                                    fetchDashboard();
                                                }
                                            }}>
                                            🗑️
                                        </button>

                                        <button
                                            className={`btn btn-sm fw-bold flex-grow-1 flex-md-grow-0 px-3 ${btnClass}`}
                                            onClick={() => {
                                                setSelectedItemForService({ id: item.item_id, task: item.tarea });
                                                setShowRegisterModal(true);
                                            }}
                                        >
                                            {btnText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* MODAL ITEMS */}
                <ItemFormModal
                    show={showItemModal}
                    onClose={() => setShowItemModal(false)}
                    planId={moto.plan_id}
                    onSubmit={addItem}
                    onSuccess={() => fetchDashboard()}
                />

                {/* MODAL KM (NUEVO) */}
                <UpdateKmModal
                    show={showKmModal}
                    onClose={() => setShowKmModal(false)}
                    motoId={moto.id}
                    currentKm={moto.km_actual}
                    onSuccess={() => fetchDashboard()}
                />

                {/* MODAL CHECK (Service) */}
                {selectedItemForService && (
                    <RegisterServiceModal
                        show={showRegisterModal}
                        onClose={() => setShowRegisterModal(false)}
                        motoId={moto.id}
                        itemId={selectedItemForService.id}
                        taskName={selectedItemForService.task}
                        currentKm={moto.km_actual}
                        onSubmit={handleRegisterService}
                        onSuccess={() => fetchDashboard()}
                    />
                )}

                {/* MODAL HISTORY */}
                {selectedItemForHistory && (
                    <HistoryListModal
                        show={showHistoryModal}
                        onClose={() => setShowHistoryModal(false)}
                        motoId={moto.id}
                        itemId={selectedItemForHistory.id === 0 ? null : selectedItemForHistory.id}
                        taskName={selectedItemForHistory.task}
                    />
                )}

                {/* MODAL ODOMETER HISTORY */}
                <OdometerHistoryModal
                    show={showOdometerHistoryModal}
                    onClose={() => setShowOdometerHistoryModal(false)}
                    motoId={moto.id}
                />

                {/* MODALS FUEL */}
                <FuelFormModal
                    show={showFuelFormModal}
                    onClose={() => setShowFuelFormModal(false)}
                    motoId={moto.id}
                    currentKm={moto.km_actual}
                    onSuccess={() => fetchDashboard()}
                />

                <FuelHistoryModal
                    show={showFuelHistoryModal}
                    onClose={() => setShowFuelHistoryModal(false)}
                    motoId={moto.id}
                    onSuccess={() => fetchDashboard()}
                />
            </div>
        </div>
    );
};