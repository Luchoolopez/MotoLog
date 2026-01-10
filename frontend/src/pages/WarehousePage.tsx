import { useState, useEffect } from "react";
import { WarehouseService, type WarehouseItem } from "../services/warehouse.service";
import { WarehouseItemModal } from "../components/modal/warehouse/WarehouseItemModal";
import { ItemUsageHistoryModal } from "../components/modal/warehouse/ItemUsageHistoryModal";
import { InstallItemModal } from "../components/modal/warehouse/InstallItemModal";
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
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [itemToInstall, setItemToInstall] = useState<WarehouseItem | null>(null);

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

    const handleInstall = (item: WarehouseItem) => {
        setItemToInstall(item);
        setShowInstallModal(true);
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

    const handleExportCSV = () => {
        if (!groups.length) return;

        // Flatten the groups to get all items
        const allItems = groups.flatMap(g => g.batches).sort((a: any, b: any) => new Date(b.fecha_compra).getTime() - new Date(a.fecha_compra).getTime());

        // Define headers
        const headers = ['Fecha Compra', 'Categoría', 'Nombre', 'Nro Parte', 'Modelo Moto', 'Lugar Compra', 'Precio', 'Cantidad Inicial', 'Stock Actual'];

        // Map data
        const csvContent = [
            headers.join(','),
            ...allItems.map(item => {
                const date = new Date(item.fecha_compra).toISOString().split('T')[0];
                const cleanName = `"${item.nombre.replace(/"/g, '""')}"`; // Escape quotes
                const cleanPart = `"${(item.nro_parte || '').replace(/"/g, '""')}"`;
                const cleanPlace = `"${(item.lugar_compra || '').replace(/"/g, '""')}"`;
                const cleanModel = `"${(item.modelo_moto || '').replace(/"/g, '""')}"`;

                return [
                    date,
                    item.categoria,
                    cleanName,
                    cleanPart,
                    cleanModel,
                    cleanPlace,
                    item.precio_compra,
                    item.cantidad,
                    item.stock_actual
                ].join(',');
            })
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `almacen_filtros_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container-fluid flex-grow-1" style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/galpon.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            color: 'white'
        }}>
            {/* Cabecera Fija */}
            <div className="sticky-top" style={{ zIndex: 1000, backgroundColor: 'rgba(23, 23, 23, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                <div className="container pt-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="mb-0" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>📦 Almacén de Repuestos</h2>
                            <p className="text-white-50">Gestiona tus repuestos, accesorios y sistemáticos</p>
                        </div>
                        <button
                            className="btn p-0 border-0"
                            onClick={() => { setSelectedItem(null); setShowModal(true); }}
                            style={{ transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            title="Cargar Compra"
                        >
                            <img
                                src="/assets/carrito_compras.png"
                                alt="Cargar Compra"
                                className="rounded-circle shadow-lg"
                                style={{
                                    height: '70px',
                                    width: '70px',
                                    objectFit: 'cover',
                                    border: '3px solid white',
                                    backgroundColor: 'white' // Added background color for transparency handling if needed
                                }}
                            />
                        </button>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="card border-0 shadow-sm bg-dark text-white p-3 mb-3">
                                <div className="row align-items-center g-3">
                                    <div className="col-sm-6 col-lg-4">
                                        <div className="d-flex gap-3 gap-md-4">
                                            <div>
                                                <small className="d-block opacity-75">Inversión Total</small>
                                                <h4 className="mb-0 fs-5 fs-md-4">${totalInversion.toLocaleString()}</h4>
                                            </div>
                                            <div className="border-start ps-3 ps-md-4">
                                                <small className="d-block opacity-75">Diferentes</small>
                                                <h4 className="mb-0 fs-5 fs-md-4">{groups.length}</h4>
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
                                    <div className="col-lg-5 col-xl-2 text-md-end">
                                        <div className="btn-group w-100" role="group">
                                            {['All', 'Repuesto', 'Accesorio', 'Sistemático'].map((cat) => (
                                                <button
                                                    key={cat}
                                                    className={`btn btn-sm py-2 py-md-1 ${filter === cat ? 'btn-light' : 'btn-outline-light'}`}
                                                    onClick={() => setFilter(cat as any)}
                                                >
                                                    {cat === 'All' ? 'Todos' : (cat === 'Sistemático' ? 'Sist.' : cat + 's')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-3 mt-1 align-items-center">
                                    <div className="col-12 col-md-auto">
                                        <small className="text-white-50 me-2">Filtrar por Fecha:</small>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text bg-transparent text-white border-secondary d-none d-sm-inline">Desde</span>
                                            <input
                                                type="date"
                                                className="form-control bg-dark text-white border-secondary"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text bg-transparent text-white border-secondary d-none d-sm-inline">Hasta</span>
                                            <input
                                                type="date"
                                                className="form-control bg-dark text-white border-secondary"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-auto ms-md-auto">
                                        <div className="d-flex gap-2 justify-content-end">
                                            {(dateFrom || dateTo) && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger border-0"
                                                    onClick={() => { setDateFrom(''); setDateTo(''); }}
                                                >
                                                    ✕ Limpiar
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm text-success border-0 fw-bold"
                                                onClick={handleExportCSV}
                                                style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}
                                                title="Descargar listado en Excel (CSV)"
                                            >
                                                📄 Descargar Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido Scrollable */}
            <div className="container pb-4 pt-3">
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
                    <div className="d-flex flex-column gap-3" id="warehouseAccordion">
                        {groups.map((group, gIdx) => (
                            <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-3" key={gIdx} style={{ backgroundColor: 'rgba(33, 37, 41, 0.95)' }}>
                                <div className="card-header bg-transparent p-0 border-0">
                                    <button
                                        className="btn btn-link w-100 text-decoration-none text-white p-3 text-start d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 hover-effect"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${gIdx}`}
                                        aria-expanded="true"
                                    >
                                        <div className="flex-grow-1 w-100">
                                            {/* Línea 1: Categoría, Nombre y N/P */}
                                            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                                                <span className={`badge rounded-pill px-3 ${group.categoria === 'Repuesto' ? 'bg-primary bg-opacity-75 text-white' :
                                                    group.categoria === 'Accesorio' ? 'bg-info bg-opacity-75 text-white' : 'bg-warning bg-opacity-75 text-dark'
                                                    }`}>
                                                    {group.categoria}
                                                </span>
                                                <h5 className="mb-0 fw-bold flex-grow-1 text-white">{group.nombre}</h5>
                                                {group.nro_parte && (
                                                    <span className="badge bg-secondary px-2 py-1 rounded-1 text-uppercase text-white" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                                                        N/P: {group.nro_parte}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Línea 2: Modelo y Stock Info */}
                                            <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 align-items-start align-items-md-center">
                                                <small className="text-white-50">{group.modelo_moto || 'Compatible con todas'}</small>
                                                <div className="vr d-none d-md-block bg-white opacity-50" style={{ height: '15px' }}></div>
                                                <div className="d-flex flex-wrap gap-3">
                                                    <div className="d-flex align-items-center gap-1">
                                                        <span className="text-white-50 small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Stock:</span>
                                                        <span className={`fw-bold ${group.stockActual > 0 ? 'text-success' : 'text-danger'}`}>
                                                            {group.stockActual > 0 ? group.stockActual : 'SIN STOCK'}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-1">
                                                        <span className="text-white-50 small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Comprado:</span>
                                                        <span className="fw-bold text-white">{group.totalComprado}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="d-flex gap-2 align-items-center align-self-end align-self-md-center">
                                            <button
                                                className="btn btn-sm btn-outline-light border-0 rounded-circle p-2"
                                                onClick={(e) => { e.stopPropagation(); handleHistory(group.batches[0]); }}
                                                title="Ver Historial"
                                            >
                                                🕓
                                            </button>
                                            <span className="fs-5 text-white-50">▾</span>
                                        </div>
                                    </button>
                                </div>
                                <div id={`collapse-${gIdx}`} className="collapse show border-top">
                                    <div className="card-body p-0 bg-light bg-opacity-25">
                                        <div className="table-responsive">
                                            <table className="table table-sm table-hover align-middle mb-0">
                                                <thead className="bg-white border-bottom">
                                                    <tr style={{ fontSize: '0.75rem' }}>
                                                        <th className="ps-2 ps-md-4 py-2 text-muted text-uppercase fw-bold">Fecha</th>
                                                        <th className="py-2 text-muted text-uppercase fw-bold d-none d-md-table-cell">Lugar</th>
                                                        <th className="text-end py-2 text-muted text-uppercase fw-bold">Precio</th>
                                                        <th className="text-center py-2 text-muted text-uppercase fw-bold">Stock</th>
                                                        <th className="text-end pe-2 pe-md-4 py-2 text-muted text-uppercase fw-bold">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {group.batches.sort((a: any, b: any) => new Date(b.fecha_compra).getTime() - new Date(a.fecha_compra).getTime()).map((item: WarehouseItem) => (
                                                        <tr key={item.id} className="bg-white hover:bg-light transition-colors">
                                                            <td className="ps-2 ps-md-4 py-3">{new Date(item.fecha_compra).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                                                            <td className="py-3 text-muted d-none d-md-table-cell">{item.lugar_compra || '-'}</td>
                                                            <td className="text-end fw-bold py-3 text-primary">${item.precio_compra.toLocaleString()}</td>
                                                            <td className="text-center py-3">
                                                                <div className="d-flex flex-column align-items-center">
                                                                    <span className={`badge rounded-pill ${item.stock_actual > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                                        {item.stock_actual} / {item.cantidad}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="text-end pe-2 pe-md-4 py-3">
                                                                <div className="btn-group shadow-sm rounded-2 overflow-hidden d-flex flex-nowrap">
                                                                    <button
                                                                        className="btn btn-sm btn-success border-0 py-1 px-2"
                                                                        onClick={() => handleInstall(item)}
                                                                        title="Instalar Repuesto"
                                                                        disabled={item.stock_actual === 0}
                                                                        style={{ fontSize: '0.75rem' }}
                                                                    >
                                                                        <span className="d-none d-md-inline">🛠️ Instalar</span>
                                                                        <span className="d-md-none">🛠️</span>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-primary border-0 py-1 px-2"
                                                                        onClick={() => handleEdit(item)}
                                                                        title="Editar"
                                                                        style={{ fontSize: '0.75rem' }}
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-danger border-0 py-1 px-2"
                                                                        onClick={() => handleDelete(item.id)}
                                                                        title="Eliminar"
                                                                        style={{ fontSize: '0.75rem' }}
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

                <InstallItemModal
                    show={showInstallModal}
                    onClose={() => setShowInstallModal(false)}
                    onSuccess={fetchItems}
                    item={itemToInstall}
                />
            </div>
        </div>
    );
};

export default WarehousePage;
