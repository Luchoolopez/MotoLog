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

    if (loading || !moto) return <div className="p-5 text-center">Analizando moto... 🔧</div>;

    return (
        <div className="container mt-4">
            <div className="card bg-dark text-white mb-4 shadow">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <Link to="/" className="text-white-50 text-decoration-none mb-1 d-block">← Volver al Garage</Link>
                        <h2 className="mb-0">{moto.marca} {moto.modelo}</h2>
                        <div className="d-flex align-items-center gap-2 mt-2">
                            <span className="badge bg-light text-dark">{moto.patente}</span>
                            {averageConsumption !== null && (
                                <span className="badge bg-success" title={`Consumo: ${averageConsumption.kmPerLiter.toFixed(2)} km/l | ${averageConsumption.litersPer100Km.toFixed(2)} L/100km`}>
                                    ⛽ {averageConsumption.kmPerLiter.toFixed(1)} km/l | {averageConsumption.litersPer100Km.toFixed(1)} L/100km
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="display-6">{moto.km_actual.toLocaleString()} km</div>
                        <div className="d-flex gap-2 justify-content-end mt-2">
                            <button
                                className="btn btn-sm btn-outline-light"
                                onClick={() => setShowOdometerHistoryModal(true)}
                                title="Ver historial de kilómetros"
                            >
                                🕓 Historial
                            </button>
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => setShowKmModal(true)} // Abrir modal KM
                            >
                                ✏️ Actualizar Km
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Estado de Mantenimiento</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-success btn-sm" onClick={() => setShowFuelHistoryModal(true)}>
                        ⛽ Historial Combustible
                    </button>
                    <button className="btn btn-success btn-sm" onClick={() => setShowFuelFormModal(true)}>
                        + Cargar Nafta
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowItemModal(true)}>
                        + Agregar Tarea
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
                    // ... (Tu lógica de colores e iconos sigue igual)
                    let icon = '🟢';
                    let borderClass = 'border-start border-5 border-success';
                    let bgClass = '';
                    let btnText = 'Registrar';
                    let btnClass = 'btn-outline-primary';

                    if (item.estado === 'ALERTA') {
                        icon = '🟡';
                        borderClass = 'border-start border-5 border-warning';
                        bgClass = 'bg-warning bg-opacity-10';
                        btnText = 'Registrar Pronto';
                        btnClass = 'btn-warning';
                    } else if (item.estado === 'VENCIDO') {
                        icon = '🔴';
                        borderClass = 'border-start border-5 border-danger';
                        bgClass = 'bg-danger bg-opacity-10';
                        btnText = '¡REGISTRAR YA!';
                        btnClass = 'btn-danger';
                    }

                    return (
                        <div key={item.item_id} className={`list-group-item p-3 ${borderClass} ${bgClass}`}>
                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-1 d-flex align-items-center gap-2">
                                        {icon} {item.tarea}
                                    </h5>
                                    <div className="text-muted small mt-1">
                                        {item.estado === 'OK' ? (
                                            <span>
                                                Te quedan <strong>{item.km_restantes} km</strong>
                                                {/* Hidden if dias_restantes is basically infinity (9999) */}
                                                {item.dias_restantes < 3650 && item.dias_restantes > 0 && (
                                                    <span> o <strong>{item.dias_restantes} días</strong></span>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-danger fw-bold">
                                                {/* Aqui corregimos visualmente si el backend manda negativo */}
                                                {item.km_restantes < 0
                                                    ? `¡Te pasaste por ${Math.abs(item.km_restantes)} km!`
                                                    : (item.dias_restantes < 3650 && item.dias_restantes < 0)
                                                        ? `¡Vencido hace ${Math.abs(item.dias_restantes)} día${Math.abs(item.dias_restantes) === 1 ? '' : 's'}!`
                                                        : `Faltan ${item.km_restantes} km.`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex gap-2 align-items-center">
                                    <button
                                        className="btn btn-outline-info btn-sm"
                                        title="Ver Historial"
                                        onClick={() => {
                                            setSelectedItemForHistory({ id: item.item_id, task: item.tarea });
                                            setShowHistoryModal(true);
                                        }}
                                    >
                                        Ver 👁️
                                    </button>

                                    <button className="btn btn-outline-danger btn-sm"
                                        onClick={async () => {
                                            // Using standard confirm as placeholder, ideally use toast/modal but specific request was just replace alerts
                                            // keeping this simple for now or using the confirm replacement if requested later.
                                            // The user hasn't complained about this confirm specifically yet.
                                            if (confirm('¿Borrar regla?')) {
                                                await deleteItem(item.item_id);
                                                fetchDashboard();
                                            }
                                        }}>
                                        🗑️
                                    </button>

                                    <button
                                        className={`btn btn-sm fw-bold ${btnClass}`}
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
    );
};