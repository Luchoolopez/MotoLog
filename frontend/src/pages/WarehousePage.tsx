import { useState, useEffect } from "react";
import { WarehouseService, type WarehouseItem } from "../services/warehouse.service";
import { WarehouseItemModal } from "../components/modal/warehouse/WarehouseItemModal";
import { useToast } from "../context/ToastContext";

const WarehousePage = () => {
    const [items, setItems] = useState<WarehouseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
    const [filter, setFilter] = useState<'All' | 'Repuesto' | 'Accesorio' | 'Sistemático'>('All');

    const { showToast } = useToast();

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await WarehouseService.getAll();
            setItems(data);
        } catch (error: any) {
            showToast('Error al cargar el almacén', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEdit = (item: WarehouseItem) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este item del almacén?')) {
            try {
                await WarehouseService.delete(id);
                showToast('Item eliminado', 'success');
                fetchItems();
            } catch (error: any) {
                showToast('Error al eliminar', 'error');
            }
        }
    };

    const filteredItems = items.filter(item =>
        filter === 'All' ? true : item.categoria === filter
    );

    const totalInversion = items.reduce((acc, item) => acc + (item.precio_compra * item.cantidad), 0);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">📦 Almacén de Repuestos</h2>
                    <p className="text-muted">Gestiona tus repuestos, accesorios y sistemáticos</p>
                </div>
                <button
                    className="btn btn-primary btn-lg shadow-sm"
                    onClick={() => { setSelectedItem(null); setShowModal(true); }}
                >
                    + Cargar Compra
                </button>
            </div>

            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="btn-group shadow-sm" role="group">
                        <button
                            className={`btn ${filter === 'All' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setFilter('All')}
                        >
                            Todos ({items.length})
                        </button>
                        <button
                            className={`btn ${filter === 'Repuesto' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setFilter('Repuesto')}
                        >
                            Repuestos ({items.filter(i => i.categoria === 'Repuesto').length})
                        </button>
                        <button
                            className={`btn ${filter === 'Accesorio' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setFilter('Accesorio')}
                        >
                            Accesorios ({items.filter(i => i.categoria === 'Accesorio').length})
                        </button>
                        <button
                            className={`btn ${filter === 'Sistemático' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setFilter('Sistemático')}
                        >
                            Sistemáticos ({items.filter(i => i.categoria === 'Sistemático').length})
                        </button>
                    </div>
                </div>
                <div className="col-md-4 text-end">
                    <div className="card border-0 shadow-sm bg-success text-white">
                        <div className="card-body py-2 px-3">
                            <small className="d-block opacity-75">Inversión Total</small>
                            <h4 className="mb-0">${totalInversion.toLocaleString()}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 border-dashed">
                    <h3 className="text-muted mb-0">No hay items en esta categoría</h3>
                    <p className="text-muted">¡Tus compras aparecerán aquí!</p>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded-4 overflow-hidden bg-white">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Item / Nomenclatura</th>
                                <th>Modelo</th>
                                <th>Categoría</th>
                                <th>Nro Parte</th>
                                <th>Fecha</th>
                                <th className="text-end">Precio Un.</th>
                                <th className="text-center">Cant.</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="fw-bold text-primary">{item.nombre}</div>
                                        <small className="text-muted d-block" style={{ maxWidth: '200px' }}>
                                            {item.lugar_compra ? `🛒 ${item.lugar_compra}` : ''}
                                        </small>
                                    </td>
                                    <td>
                                        <span className="text-muted small">{item.modelo_moto || '-'}</span>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${item.categoria === 'Repuesto' ? 'bg-primary' :
                                            item.categoria === 'Accesorio' ? 'bg-info' : 'bg-warning text-dark'
                                            }`}>
                                            {item.categoria}
                                        </span>
                                    </td>
                                    <td><code className="text-dark bg-light px-2 rounded small">{item.nro_parte || '-'}</code></td>
                                    <td>{new Date(item.fecha_compra).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                                    <td className="text-end fw-bold">${item.precio_compra.toLocaleString()}</td>
                                    <td className="text-center">
                                        <span className="badge bg-secondary">{item.cantidad}</span>
                                    </td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2 shadow-sm"
                                            onClick={() => handleEdit(item)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger shadow-sm"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <WarehouseItemModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchItems}
                initialData={selectedItem}
            />
        </div>
    );
};

export default WarehousePage;
