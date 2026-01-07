import { useState, useEffect } from "react";
import { WarehouseService, type WarehouseItem } from "../services/warehouse.service";
import { WarehouseItemModal } from "../components/modal/warehouse/WarehouseItemModal";
import { ItemUsageHistoryModal } from "../components/modal/warehouse/ItemUsageHistoryModal";
import { useToast } from "../context/ToastContext";

const WarehousePage = () => {
    const [items, setItems] = useState<WarehouseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [filter, setFilter] = useState<'All' | 'Repuesto' | 'Accesorio' | 'Sistemático'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

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

    const handleHistory = (item: WarehouseItem) => {
        setSelectedItem(item);
        setShowHistoryModal(true);
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

    // --- Grouping Logic ---
    const groupedItems = items.reduce((acc, item) => {
        if (filter !== 'All' && item.categoria !== filter) return acc;

        const searchUpper = searchTerm.toUpperCase();
        const itemNombre = item.nombre.toUpperCase();
        const itemParte = (item.nro_parte || '').toUpperCase();

        if (searchTerm && !itemNombre.includes(searchUpper) && !itemParte.includes(searchUpper)) {
            return acc;
        }

        // --- Date Filter ---
        if (dateFrom || dateTo) {
            const itemDate = new Date(item.fecha_compra).toISOString().split('T')[0];
            if (dateFrom && itemDate < dateFrom) return acc;
            if (dateTo && itemDate > dateTo) return acc;
        }

        const key = `${item.nombre.toLowerCase()}_${(item.nro_parte || '').toLowerCase()}`;
        if (!acc[key]) {
            acc[key] = {
                nombre: item.nombre,
                nro_parte: item.nro_parte,
                categoria: item.categoria,
                modelo_moto: item.modelo_moto,
                totalComprado: 0,
                stockActual: 0,
                batches: []
            };
        }
        acc[key].totalComprado += item.cantidad;
        acc[key].stockActual += item.stock_actual;
        acc[key].batches.push(item);
        return acc;
    }, {} as Record<string, any>);

    const groups = Object.values(groupedItems).sort((a, b) => a.nombre.localeCompare(b.nombre));

    const totalInversion = items.reduce((acc, item) => {
        // Apply the same filters to the total investment
        if (filter !== 'All' && item.categoria !== filter) return acc;

        const searchUpper = searchTerm.toUpperCase();
        if (searchTerm && !item.nombre.toUpperCase().includes(searchUpper) && !(item.nro_parte || '').toUpperCase().includes(searchUpper)) {
            return acc;
        }

        if (dateFrom || dateTo) {
            const itemDate = new Date(item.fecha_compra).toISOString().split('T')[0];
            if (dateFrom && itemDate < dateFrom) return acc;
            if (dateTo && itemDate > dateTo) return acc;
        }

        return acc + (item.precio_compra * item.cantidad);
    }, 0);

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
                <div className="col-md-12">
                    <div className="card border-0 shadow-sm bg-dark text-white p-3 mb-3">
                        <div className="row align-items-center g-3">
                            <div className="col-lg-4">
                                <div className="d-flex gap-4">
                                    <div>
                                        <small className="d-block opacity-75">Inversión Total</small>
                                        <h4 className="mb-0">${totalInversion.toLocaleString()}</h4>
                                    </div>
                                    <div>
                                        <small className="d-block opacity-75">Items Diferentes</small>
                                        <h4 className="mb-0">{groups.length}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-0 pe-0">🔍</span>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none ps-2"
                                        placeholder="Buscar por nombre o número de parte..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 text-end">
                                <div className="btn-group" role="group">
                                    {['All', 'Repuesto', 'Accesorio', 'Sistemático'].map((cat) => (
                                        <button
                                            key={cat}
                                            className={`btn btn-sm ${filter === cat ? 'btn-light' : 'btn-outline-light'}`}
                                            onClick={() => setFilter(cat as any)}
                                        >
                                            {cat === 'All' ? 'Todos' : cat + 's'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="row g-3 mt-1 align-items-center">
                            <div className="col-md-auto">
                                <small className="text-white-50 me-2">Filtrar por Fecha:</small>
                            </div>
                            <div className="col-md-3">
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-transparent text-white border-secondary">Desde</span>
                                    <input
                                        type="date"
                                        className="form-control bg-dark text-white border-secondary"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-transparent text-white border-secondary">Hasta</span>
                                    <input
                                        type="date"
                                        className="form-control bg-dark text-white border-secondary"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-auto">
                                {(dateFrom || dateTo) && (
                                    <button
                                        className="btn btn-sm btn-outline-danger border-0"
                                        onClick={() => { setDateFrom(''); setDateTo(''); }}
                                    >
                                        ✕ Limpiar Fechas
                                    </button>
                                )}
                            </div>
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
            ) : groups.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 border-dashed">
                    <h3 className="text-muted mb-0">No hay items registrados</h3>
                </div>
            ) : (
                <div className="accordion shadow-sm rounded-4 overflow-hidden" id="warehouseAccordion">
                    {groups.map((group, gIdx) => (
                        <div className="accordion-item border-0 border-bottom" key={gIdx}>
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button bg-white py-3 shadow-none"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse-${gIdx}`}
                                    aria-expanded="true"
                                >
                                    <div className="container-fluid p-0">
                                        <div className="row align-items-center g-2">
                                            <div className="col-md-5">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`badge rounded-pill ${group.categoria === 'Repuesto' ? 'bg-primary' :
                                                        group.categoria === 'Accesorio' ? 'bg-info' : 'bg-warning text-dark'
                                                        }`}>
                                                        {group.categoria}
                                                    </span>
                                                    <span className="fw-bold fs-5 text-dark">{group.nombre}</span>
                                                    {group.nro_parte && <code className="ms-2">{group.nro_parte}</code>}
                                                </div>
                                                <small className="text-muted">{group.modelo_moto || 'Compatible con todas'}</small>
                                            </div>
                                            <div className="col-md-2 text-center border-start border-end">
                                                <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Comprado</small>
                                                <span className="fs-5 fw-bold">{group.totalComprado}</span>
                                            </div>
                                            <div className="col-md-2 text-center border-end">
                                                <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>En Stock</small>
                                                {group.stockActual > 0 ? (
                                                    <span className="fs-4 fw-bold text-success">{group.stockActual}</span>
                                                ) : (
                                                    <span className="badge bg-danger">SIN STOCK</span>
                                                )}
                                            </div>
                                            <div className="col-md-3 text-end pe-4">
                                                <button
                                                    className="btn btn-sm btn-info text-white shadow-sm"
                                                    onClick={(e) => { e.stopPropagation(); handleHistory(group.batches[0]); }}
                                                >
                                                    🕓 Historial Global
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </h2>
                            <div id={`collapse-${gIdx}`} className="accordion-collapse collapse show">
                                <div className="accordion-body p-0 bg-light bg-opacity-50">
                                    <div className="table-responsive">
                                        <table className="table table-sm table-borderless align-middle mb-0">
                                            <thead className="small text-muted text-uppercase border-bottom">
                                                <tr>
                                                    <th className="ps-4 py-2">Fecha Compra</th>
                                                    <th className="py-2">Lugar</th>
                                                    <th className="text-end py-2">Precio Un.</th>
                                                    <th className="text-center py-2">Cant. Compra</th>
                                                    <th className="text-center py-2">Cant. Stock</th>
                                                    <th className="text-end pe-4 py-2">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.batches.sort((a: any, b: any) => new Date(b.fecha_compra).getTime() - new Date(a.fecha_compra).getTime()).map((item: WarehouseItem) => (
                                                    <tr key={item.id} className="border-bottom-dashed">
                                                        <td className="ps-4 py-3">{new Date(item.fecha_compra).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                                                        <td className="py-3">{item.lugar_compra || '-'}</td>
                                                        <td className="text-end fw-bold py-3">${item.precio_compra.toLocaleString()}</td>
                                                        <td className="text-center py-3">
                                                            <span className="badge bg-secondary">{item.cantidad}</span>
                                                        </td>
                                                        <td className="text-center py-3">
                                                            <span className={`badge ${item.stock_actual > 0 ? 'bg-success' : 'bg-danger'}`}>{item.stock_actual}</span>
                                                        </td>
                                                        <td className="text-end pe-4 py-3">
                                                            <button
                                                                className="btn btn-xs btn-outline-primary me-1 py-0 px-2 shadow-sm"
                                                                onClick={() => handleEdit(item)}
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                className="btn btn-xs btn-outline-danger py-0 px-2 shadow-sm"
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <WarehouseItemModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchItems}
                initialData={selectedItem}
            />

            <ItemUsageHistoryModal
                show={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                itemId={selectedItem?.id || null}
                itemName={selectedItem?.nombre || ''}
            />
        </div>
    );
};

export default WarehousePage;
