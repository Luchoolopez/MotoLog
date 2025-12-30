import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MotoService } from '../services/moto.service';
import type { MaintenanceStatus, Motorcycle } from '../types/moto.types';
import { ItemFormModal } from '../components/modal/planes/itemFormModal';
import { UpdateKmModal } from '../components/modal/planes/updateKmModal';
import { useItems } from '../hooks/useItem';

export const MotoDashboard = () => {
    const { id } = useParams();
    const motoId = Number(id);

    const { addItem, deleteItem } = useItems();

    const [moto, setMoto] = useState<Motorcycle | null>(null);
    const [statuses, setStatuses] = useState<MaintenanceStatus[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para los modales
    const [showItemModal, setShowItemModal] = useState(false);
    const [showKmModal, setShowKmModal] = useState(false); // Estado para modal de KM

    const fetchDashboard = async () => {
        try {
            // setLoading(true); // Opcional: comentar para que no parpadee al actualizar solo KM
            const [motoData, statusData] = await Promise.all([
                MotoService.getById(motoId),
                MotoService.getStatus(motoId)
            ]);
            setMoto(motoData);
            setStatuses(statusData);
        } catch (error) {
            console.error("Error cargando dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [motoId]);

    if (loading || !moto) return <div className="p-5 text-center">Analizando moto... 🔧</div>;

    return (
        <div className="container mt-4">
            <div className="card bg-dark text-white mb-4 shadow">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <Link to="/" className="text-white-50 text-decoration-none mb-1 d-block">← Volver al Garage</Link>
                        <h2 className="mb-0">{moto.marca} {moto.modelo}</h2>
                        <span className="badge bg-light text-dark mt-2">{moto.patente}</span>
                    </div>
                    <div className="text-end">
                        <div className="display-6">{moto.km_actual.toLocaleString()} km</div>
                        <button 
                            className="btn btn-sm btn-outline-light mt-2"
                            onClick={() => setShowKmModal(true)} // Abrir modal KM
                        >
                            ✏️ Actualizar Km
                        </button>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Estado de Mantenimiento</h4>
                <button className="btn btn-primary btn-sm" onClick={() => setShowItemModal(true)}>
                    + Agregar Regla
                </button>
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
                    let btnText = 'Ver Detalle';
                    
                    if (item.estado === 'ALERTA') {
                        icon = '🟡';
                        borderClass = 'border-start border-5 border-warning';
                        bgClass = 'bg-warning bg-opacity-10';
                        btnText = 'Registrar Pronto';
                    } else if (item.estado === 'VENCIDO') {
                        icon = '🔴';
                        borderClass = 'border-start border-5 border-danger';
                        bgClass = 'bg-danger bg-opacity-10';
                        btnText = '¡REGISTRAR YA!';
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
                                            <span>Te quedan <strong>{item.km_restantes} km</strong></span>
                                        ) : (
                                            <span className="text-danger fw-bold">
                                                {/* Aquí corregimos visualmente si el backend manda negativo */}
                                                {item.km_restantes < 0 
                                                    ? `Te pasaste por ${Math.abs(item.km_restantes)} km!` 
                                                    : `Faltan ${item.km_restantes} km.`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="d-flex gap-2 align-items-center">
                                     <button className="btn btn-outline-danger btn-sm"
                                        onClick={async () => {
                                            if(confirm('¿Borrar regla?')) {
                                                await deleteItem(item.item_id);
                                                fetchDashboard();
                                            }
                                        }}>
                                        🗑️
                                    </button>
                                    {item.estado !== 'OK' && (
                                        <button className={`btn btn-sm fw-bold ${item.estado === 'VENCIDO' ? 'btn-danger' : 'btn-warning'}`}>
                                            {btnText}
                                        </button>
                                    )}
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
        </div>
    );
};