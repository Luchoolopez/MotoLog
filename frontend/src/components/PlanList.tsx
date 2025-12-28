import { useEffect, useState } from 'react';
import type { MaintenancePlan } from '../types/maintenancePlan';
import { PlanService } from '../services/planService.service';

export const PlanList = () => {
    const [planes, setPlanes] = useState<MaintenancePlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPlanes();
    }, []);

    const fetchPlanes = async () => {
        try {
            setLoading(true);
            const data = await PlanService.getAll();
            setPlanes(data);
        } catch (err) {
            setError('Error al cargar los planes. Asegúrate que el backend esté corriendo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container mt-4">Cargando planes...</div>;
    if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Planes de Mantenimiento</h2>
                <button className="btn btn-primary">
                    + Nuevo Plan
                </button>
            </div>

            {planes.length === 0 ? (
                <div className="alert alert-info">
                    No hay planes creados todavía. ¡Crea el primero!
                </div>
            ) : (
                <div className="row">
                    {planes.map((plan) => (
                        <div key={plan.id} className="col-md-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{plan.nombre}</h5>
                                    <p className="card-text text-muted">
                                        {plan.descripcion || 'Sin descripción'}
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end gap-2">
                                    <button 
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => console.log('Ver items del plan', plan.id)}
                                    >
                                        Ver Items
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={async () => {
                                            if(confirm('¿Borrar plan?')) {
                                                await PlanService.delete(plan.id);
                                                fetchPlanes();
                                            }
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};