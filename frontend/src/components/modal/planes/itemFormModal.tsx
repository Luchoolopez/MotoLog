import React, { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import type { CreateItemDto } from "../../../types/item.types";
import { WarehouseService, type WarehouseItem } from "../../../services/warehouse.service";

interface Props {
    show: boolean;
    onClose: () => void;
    planId: number;
    onSubmit: (data: CreateItemDto) => Promise<boolean>;
    onSuccess: () => void;
}

export const ItemFormModal = ({ show, onClose, planId, onSubmit, onSuccess }: Props) => {
    const [formData, setFormData] = useState({
        tarea: '',
        tipo: ['Inspección'] as string[],
        intervalo_km: 0 as string | number,
        intervalo_meses: 0 as string | number,
        consumo_sistematico: false,
        associated_items: [] as { warehouse_item_id: number, cantidad_sugerida: number }[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);
    const [warehouseSearch, setWarehouseSearch] = useState('');
    const [loadingWarehouse, setLoadingWarehouse] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        if (!show || !formData.consumo_sistematico) return;

        const fetchWarehouseItems = async () => {
            setLoadingWarehouse(true);
            try {
                const items = await WarehouseService.getAll();
                setWarehouseItems(items.filter(item =>
                    item.stock_actual > 0 &&
                    (item.categoria === 'Repuesto' || item.categoria === 'Accesorio' || item.categoria.toLowerCase().includes('sistem'))
                ));
            } catch (error) {
                console.error('Error cargando almacen:', error);
                showToast('No se pudo cargar el almacen', 'error');
            } finally {
                setLoadingWarehouse(false);
            }
        };

        fetchWarehouseItems();
    }, [show, formData.consumo_sistematico]);

    if (!show) return null;

    const groupedWarehouseItems = warehouseItems.reduce((acc: any[], item) => {
        const key = `${item.nombre.toLowerCase()}|${(item.nro_parte || '').toLowerCase()}`;
        const existing = acc.find(group => group.key === key);

        if (existing) {
            existing.stock_actual += item.stock_actual;
            existing.batchIds.push(item.id);
        } else {
            acc.push({
                key,
                nombre: item.nombre,
                nro_parte: item.nro_parte,
                stock_actual: item.stock_actual,
                batchIds: [item.id]
            });
        }

        return acc;
    }, []);

    const selectedKitItems = formData.associated_items.map(assoc => {
        const item = warehouseItems.find(wi => wi.id === assoc.warehouse_item_id);
        return item ? { ...item, cantidad_sugerida: assoc.cantidad_sugerida } : null;
    }).filter(Boolean) as Array<WarehouseItem & { cantidad_sugerida: number }>;

    const filteredWarehouseItems = groupedWarehouseItems.filter(item =>
        item.nombre.toLowerCase().includes(warehouseSearch.toLowerCase()) ||
        (item.nro_parte && item.nro_parte.toLowerCase().includes(warehouseSearch.toLowerCase()))
    );

    const handleAddSuggestedItem = (groupedItem: any) => {
        const firstAvailableId = groupedItem.batchIds[0];
        const alreadySelected = formData.associated_items.some(item => item.warehouse_item_id === firstAvailableId);

        if (alreadySelected) {
            return showToast('Ese repuesto ya esta en el kit', 'warning');
        }

        setFormData(prev => ({
            ...prev,
            associated_items: [
                ...prev.associated_items,
                { warehouse_item_id: firstAvailableId, cantidad_sugerida: 1 }
            ]
        }));
        setWarehouseSearch('');
    };

    const handleSuggestedQtyChange = (warehouseItemId: number, quantity: number) => {
        setFormData(prev => ({
            ...prev,
            associated_items: prev.associated_items.map(item =>
                item.warehouse_item_id === warehouseItemId
                    ? { ...item, cantidad_sugerida: Math.max(1, quantity || 1) }
                    : item
            )
        }));
    };

    const handleRemoveSuggestedItem = (warehouseItemId: number) => {
        setFormData(prev => ({
            ...prev,
            associated_items: prev.associated_items.filter(item => item.warehouse_item_id !== warehouseItemId)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.tarea.trim()) return showToast("La tarea es obligatoria", 'warning');

        setIsSubmitting(true);

        const newItem: CreateItemDto = {
            plan_id: planId,
            tarea: formData.tarea,
            tipo: formData.tipo.join(','), // Convert array to comma-separated string
            intervalo_km: Number(formData.intervalo_km),
            intervalo_meses: Number(formData.intervalo_meses),
            consumo_sistematico: formData.consumo_sistematico,
            associated_items: formData.consumo_sistematico ? formData.associated_items : []
        };

        const success = await onSubmit(newItem);

        setIsSubmitting(false);

        if (success) {
            setFormData({ tarea: '', tipo: ['Inspección'], intervalo_km: 0, intervalo_meses: 0, consumo_sistematico: false, associated_items: [] });
            setWarehouseSearch('');
            onSuccess();
            onClose();
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Nueva Regla de Mantenimiento</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Tarea</label>
                                <input
                                    type="text" className="form-control"
                                    placeholder="Ej: Cambio de Aceite"
                                    value={formData.tarea}
                                    onChange={e => setFormData({ ...formData, tarea: e.target.value.toUpperCase() })}
                                    autoFocus required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tipo de Tarea (Selecciona uno o más)</label>
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                    {['Inspección', 'Cambio', 'Limpieza', 'Lubricación', 'Ajuste'].map((type) => (
                                        <div key={type} className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`type-${type}`}
                                                checked={formData.tipo.includes(type)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setFormData(prev => {
                                                        if (checked) {
                                                            return { ...prev, tipo: [...prev.tipo, type] };
                                                        } else {
                                                            return { ...prev, tipo: prev.tipo.filter(t => t !== type) };
                                                        }
                                                    });
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`type-${type}`}>
                                                {type}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Intervalo KM</label>
                                    <input
                                        type="number" className="form-control"
                                        min="0"
                                        value={formData.intervalo_km}
                                        onChange={e => setFormData({
                                            ...formData,
                                            intervalo_km: e.target.value === '' ? '' : Number(e.target.value)
                                        })}
                                        onFocus={(e) => e.target.select()}
                                        required
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Intervalo Meses</label>
                                    <input
                                        type="number" className="form-control"
                                        min="0"
                                        placeholder="0 = Sin fecha"
                                        value={formData.intervalo_meses}
                                        onChange={e => setFormData({
                                            ...formData,
                                            intervalo_meses: e.target.value === '' ? '' : Number(e.target.value)
                                        })}
                                        onFocus={(e) => e.target.select()}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3 form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="consumoSistematico"
                                    checked={formData.consumo_sistematico}
                                    onChange={e => setFormData({
                                        ...formData,
                                        consumo_sistematico: e.target.checked,
                                        associated_items: e.target.checked ? formData.associated_items : []
                                    })}
                                />
                                <label className="form-check-label fw-bold" htmlFor="consumoSistematico">
                                    ¿Lleva repuestos o sistemáticos?
                                </label>
                                <small className="text-muted d-block mt-1">
                                    Si se activa, se habilitará el buscador de stock al registrar el servicio.
                                </small>
                            </div>

                            {formData.consumo_sistematico && (
                                <div className="mt-3 p-3 bg-light rounded border">
                                    <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                                        <div>
                                            <h6 className="fw-bold mb-1">Kit sugerido para este service</h6>
                                            <small className="text-muted">Estos repuestos apareceran preseleccionados al registrar la tarea.</small>
                                        </div>
                                        {selectedKitItems.length > 0 && (
                                            <span className="badge bg-primary">{selectedKitItems.length} item{selectedKitItems.length === 1 ? '' : 's'}</span>
                                        )}
                                    </div>

                                    {selectedKitItems.length > 0 && (
                                        <div className="mb-3">
                                            {selectedKitItems.map(item => (
                                                <div key={item.id} className="d-flex align-items-center justify-content-between gap-2 border-bottom py-2">
                                                    <div style={{ minWidth: 0, flex: 1 }}>
                                                        <div className="fw-bold small text-truncate">{item.nombre}</div>
                                                        <div className="d-flex flex-wrap gap-2 mt-1">
                                                            {item.nro_parte && <span className="badge bg-white text-dark border">N.P: {item.nro_parte}</span>}
                                                            <span className="badge bg-white text-dark border">Stock: {item.stock_actual}</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={item.stock_actual}
                                                            className="form-control form-control-sm text-center"
                                                            style={{ width: '64px' }}
                                                            value={item.cantidad_sugerida}
                                                            onChange={e => handleSuggestedQtyChange(item.id, Number(e.target.value))}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleRemoveSuggestedItem(item.id)}
                                                        >
                                                            Quitar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <label className="form-label small fw-bold">Buscar repuesto en almacen</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mb-2"
                                        placeholder="Filtrar por nombre o N/P..."
                                        value={warehouseSearch}
                                        onChange={e => setWarehouseSearch(e.target.value)}
                                    />

                                    <div className="list-group overflow-auto" style={{ maxHeight: '180px', border: '1px solid #dee2e6' }}>
                                        {loadingWarehouse ? (
                                            <div className="p-3 text-center text-muted small">Cargando almacen...</div>
                                        ) : filteredWarehouseItems.length > 0 ? (
                                            filteredWarehouseItems.map((item: any) => {
                                                const isSelected = item.batchIds.some((id: number) =>
                                                    formData.associated_items.some(selected => selected.warehouse_item_id === id)
                                                );

                                                return (
                                                    <button
                                                        key={item.key}
                                                        type="button"
                                                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center small py-2 ${isSelected ? 'bg-light text-muted' : ''}`}
                                                        onClick={() => handleAddSuggestedItem(item)}
                                                        disabled={isSelected}
                                                    >
                                                        <div>
                                                            <div className="fw-bold">{item.nombre}</div>
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {item.nro_parte && <span className="extra-small opacity-75">N.P: {item.nro_parte}</span>}
                                                                {item.batchIds.length > 1 && <span className="badge bg-secondary extra-small">{item.batchIds.length} lotes</span>}
                                                            </div>
                                                        </div>
                                                        <span className={`badge rounded-pill ${item.stock_actual <= 1 ? 'bg-danger' : 'bg-primary'}`}>
                                                            {item.stock_actual}
                                                        </span>
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <div className="p-3 text-center text-muted small">No hay items disponibles</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar Regla'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
