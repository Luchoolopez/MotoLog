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
        <div className="container-fluid flex-grow-1 py-4" style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/garage-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            overflowY: 'auto' // Allow internal scrolling if content overflows
        }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Mi Garage</h1>
                    <div>
                        <Link to="/planes" className="btn btn-outline-secondary me-2" title="Configurar Planes">
                            Planes
                        </Link>
                        <button
                            className="btn p-0 border-0"
                            onClick={() => setShowModal(true)}
                            style={{ transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            title="Agregar Nueva Moto"
                        >
                            <img
                                src="/assets/agregar_moto.png"
                                alt="Nueva Moto"
                                className="rounded-circle shadow-lg"
                                style={{
                                    height: '70px',
                                    width: '70px',
                                    objectFit: 'cover',
                                    border: '3px solid white',
                                    backgroundColor: 'white'
                                }}
                            />
                        </button>
                    </div>
                </div>

                {motos.length === 0 ? (
                    <div className="text-center py-5 rounded shadow-sm" style={{ backgroundColor: 'transparent' }}>
                        <h3 className="text-white">Tu garage está vacío</h3>
                        <p className="text-white">¡Agrega tu primera moto para comenzar el seguimiento!</p>
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
                                            {moto.plan_mantenimiento?.items && moto.plan_mantenimiento.items.length > 0
                                                ? 'Con plan asignado'
                                                : 'Sin plan asignado'}
                                        </small>

                                        <button
                                            className="btn btn-link text-danger text-decoration-none btn-sm"
                                            onClick={() => {
                                                if (confirm(`¿Estás seguro de eliminar la ${moto.modelo}?`)) {
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
        </div>
    );
};