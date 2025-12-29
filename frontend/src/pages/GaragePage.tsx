import { Link } from 'react-router-dom';
import { useMotos } from '../hooks/useMoto';
import { MotoFormModal } from '../components/modal/planes/MotoFormModal';
import { useState } from 'react';

export const GaragePage = () => {
    const { motos, loading, error, removeMoto, addMoto } = useMotos();
    const [showModal, setShowModal] = useState<boolean>(false); 

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Mi Garage</h1>
                <div>
                    <Link to="/planes" className="btn btn-outline-secondary me-2" title="Configurar Planes">
                        Planes
                    </Link>
                    <button 
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}>
                        + Nueva Moto
                    </button>
                </div>
            </div>

            {motos.length === 0 ? (
                <div className="text-center py-5 bg-light rounded shadow-sm">
                    <h3>Tu garage está vacío</h3>
                    <p className="text-muted">¡Agrega tu primera moto para comenzar el seguimiento!</p>
                </div>
            ) : (
                <div className="row">
                    {motos.map(moto => (
                        <div key={moto.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 border-3">
                                <div className="card-header bg-dark text-white text-center py-3">
                                    <h4 className="card-title mb-0">{moto.marca} {moto.modelo}</h4>
                                </div>
                                
                                <div className="card-body text-center">
                                    <div className="badge bg-light text-dark mb-3 border">
                                        {moto.patente}
                                    </div>
                                    
                                    <h6 className="text-muted text-uppercase small">Kilometraje Actual</h6>
                                    <div className="display-6 mb-4 fw-bold text-primary">
                                        {moto.km_actual.toLocaleString()} <span className="fs-5 text-muted">km</span>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <Link to={`/motos/${moto.id}`} className="btn btn-outline-primary btn-lg">
                                            Ver Estado 
                                        </Link>
                                    </div>
                                </div>

                                <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                        {moto.plan_mantenimiento?.nombre || 'Sin plan asignado'}
                                    </small>
                                    
                                    <button 
                                        className="btn btn-link text-danger text-decoration-none btn-sm"
                                        onClick={() => {
                                            if(confirm(`¿Estás seguro de eliminar la ${moto.modelo}?`)) {
                                                removeMoto(moto.id);
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
            <MotoFormModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={addMoto}
            />
        </div>
    );
};