import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MotoService } from '../services/moto.service';
import type { MaintenanceStatus, Motorcycle } from '../types/moto.types';

export const MotoDashboard = () => {
    const { id } = useParams();
    const motoId = Number(id);

    const [moto, setMoto] = useState<Motorcycle | null>(null);
    const [statuses, setStatuses] = useState<MaintenanceStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, [motoId]);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            // Ejecutamos ambas peticiones en paralelo para que sea más rápido
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
                        <button className="btn btn-sm btn-outline-light mt-2">
                            ✏️ Actualizar Km
                        </button>
                    </div>
                </div>
            </div>

            <h4 className="mb-3">Estado de Mantenimiento</h4>
            
            <div className="list-group shadow-sm">
                {statuses.map((item) => {
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
                                            <span>Te quedan <strong>{item.km_restantes} km</strong> o {item.dias_restantes} días.</span>
                                        ) : (
                                            <span className="text-danger fw-bold">
                                                {item.estado === 'VENCIDO' 
                                                    ? `Te pasaste por ${Math.abs(item.km_restantes)} km!` 
                                                    : `Solo quedan ${item.km_restantes} km.`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {item.estado !== 'OK' && (
                                    <button 
                                        className={`btn btn-sm fw-bold ${item.estado === 'VENCIDO' ? 'btn-danger' : 'btn-warning'}`}
                                        onClick={() => console.log("Abrir modal registrar service", item.item_id)}
                                    >
                                        {btnText}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};