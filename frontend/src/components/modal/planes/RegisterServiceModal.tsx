import React, { useState, useEffect } from "react";
import type { CreateHistoryDto } from "../../../services/maintenanceHistory.service";
import { ItemService } from "../../../services/item.service";
import type { ItemPlan } from "../../../types/item.types";
import { WarehouseService, type WarehouseItem } from "../../../services/warehouse.service";

interface Props {
    show: boolean;
    onClose: () => void;
    motoId: number;
    itemId: number;
    taskName: string;
    currentKm: number;
    onSubmit: (data: CreateHistoryDto) => Promise<boolean>;
    onSuccess: () => void;
}

export const RegisterServiceModal = ({ show, onClose, motoId, itemId, taskName, currentKm, onSubmit, onSuccess }: Props) => {
    const [formData, setFormData] = useState({
        fecha_realizado: new Date().toISOString().split('T')[0],
        km_realizado: currentKm as string | number,
        observaciones: '',
        consumed_items: [] as {
            nombre: string,
            nro_parte: string | null,
            cantidad_usada: number,
            stock_actual: number,
            batchIds: number[] // IDs of items that belong to this group
        }[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [llevaSistematicos, setLlevaSistematicos] = useState(false);

    // Fetch warehouse items for manual selection
    useEffect(() => {
        if (show) {
            const fetchItems = async () => {
                try {
                    const items = await WarehouseService.getAll();
                    // Filter: Only items with stock and relevant categories
                    setWarehouseItems(items.filter(i =>
                        i.stock_actual > 0 &&
                        (i.categoria === 'Repuesto' || i.categoria === 'Sistemático' || i.categoria === 'Accesorio')
                    ));
                } catch (error) {
                    console.error("Error fetching warehouse items", error);
                }
            };
            fetchItems();
        }
    }, [show]);

    useEffect(() => {
        if (show && itemId) {
            const fetchItemDetails = async () => {
                try {
                    const item: ItemPlan = await ItemService.getById(itemId);
                    console.log("Item details fetched:", item);
                    setLlevaSistematicos(item.consumo_sistematico || false);
                    if (item.items_almacen_asociados) {
                        setFormData(prev => ({
                            ...prev,
                            consumed_items: item.items_almacen_asociados?.map(wi => {
                                // For associated items, we treat them as individual selections for now 
                                // or we could group them. Let's keep them as is but match the new structure.
                                const joinData = (wi as any).item_plan_warehouse || (wi as any).ItemPlanWarehouse;
                                return {
                                    nombre: wi.nombre,
                                    nro_parte: wi.nro_parte || null,
                                    cantidad_usada: (joinData?.cantidad_sugerida || 1) as number,
                                    stock_actual: (wi.stock_actual || 0) as number,
                                    batchIds: [wi.id]
                                };
                            }) || []
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching item details", error);
                }
            };
            fetchItemDetails();
        }
    }, [show, itemId]);

    const handleRemoveConsumedItem = (index: number) => {
        const newConsumed = [...formData.consumed_items];
        newConsumed.splice(index, 1);
        setFormData({ ...formData, consumed_items: newConsumed });
    };

    const handleConsumedQtyChange = (index: number, qty: number) => {
        const newConsumed = [...formData.consumed_items];
        newConsumed[index].cantidad_usada = qty;
        setFormData({ ...formData, consumed_items: newConsumed });
    };

    const handleAddItem = (groupedItem: any) => {
        const existingIndex = formData.consumed_items.findIndex(i =>
            i.nombre === groupedItem.nombre && i.nro_parte === groupedItem.nro_parte
        );

        if (existingIndex >= 0) {
            handleConsumedQtyChange(existingIndex, formData.consumed_items[existingIndex].cantidad_usada + 1);
        } else {
            setFormData({
                ...formData,
                consumed_items: [
                    ...formData.consumed_items,
                    {
                        nombre: groupedItem.nombre,
                        nro_parte: groupedItem.nro_parte,
                        cantidad_usada: 1,
                        stock_actual: groupedItem.stock_actual,
                        batchIds: groupedItem.batchIds
                    }
                ]
            });
        }
        setSearchTerm('');
    };

    const groupedWarehouseItems = warehouseItems.reduce((acc: any[], item) => {
        const key = `${item.nombre.toLowerCase()}|${(item.nro_parte || '').toLowerCase()}`;
        const existing = acc.find(i => i.key === key);
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

    const filteredWarehouseItems = groupedWarehouseItems.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.nro_parte && item.nro_parte.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // FIFO Logic: Spreading consumed quantities across individual batches
        const finalConsumed: { warehouse_item_id: number, cantidad_usada: number }[] = [];

        for (const grouped of formData.consumed_items) {
            let pendingQty = grouped.cantidad_usada;

            // Get all batches for this group, sorted by ID (usually purchase order) 
            // Better would be to have purchase date here, but ID is a good proxy if dates aren't in this specific join.
            // Actually warehouseItems has all data including dates.
            const batches = warehouseItems
                .filter(wi => grouped.batchIds.includes(wi.id))
                .sort((a, b) => new Date(a.fecha_compra).getTime() - new Date(b.fecha_compra).getTime());

            for (const batch of batches) {
                if (pendingQty <= 0) break;

                const take = Math.min(batch.stock_actual, pendingQty);
                if (take > 0) {
                    finalConsumed.push({
                        warehouse_item_id: batch.id,
                        cantidad_usada: take
                    });
                    pendingQty -= take;
                }
            }

            // If we still have pending quantity (shouldn't happen if UI validation is correct)
            // we attach it to the first batch anyway or error out
            if (pendingQty > 0 && batches.length > 0) {
                const firstBatch = finalConsumed.find(fc => fc.warehouse_item_id === batches[0].id);
                if (firstBatch) {
                    firstBatch.cantidad_usada += pendingQty;
                } else {
                    finalConsumed.push({ warehouse_item_id: batches[0].id, cantidad_usada: pendingQty });
                }
            }
        }

        const newRecord: CreateHistoryDto = {
            moto_id: motoId,
            item_plan_id: itemId,
            fecha_realizado: formData.fecha_realizado,
            km_realizado: Number(formData.km_realizado),
            observaciones: formData.observaciones,
            consumed_items: finalConsumed
        };

        const success = await onSubmit(newRecord);
        setIsSubmitting(false);

        if (success) {
            onSuccess();
            onClose();
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(5px)' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Registrar Service: {taskName}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Fecha Realizado</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    max={new Date().toISOString().split('T')[0]}
                                    value={formData.fecha_realizado}
                                    onChange={e => setFormData({ ...formData, fecha_realizado: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Kilometraje Realizado</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    value={formData.km_realizado}
                                    onChange={e => setFormData({
                                        ...formData,
                                        km_realizado: e.target.value === '' ? '' : Number(e.target.value)
                                    })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Observaciones (Opcional)</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    value={formData.observaciones}
                                    onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                                ></textarea>
                            </div>

                            {formData.consumed_items.length > 0 && (
                                <div className="mt-3 p-3 bg-light rounded border">
                                    <h6 className="fw-bold mb-2">📦 Repuestos / Consumibles usados:</h6>
                                    <small className="text-muted d-block mb-3">Se descontarán automáticamente del almacén.</small>

                                    {formData.consumed_items.map((item, index) => (
                                        <div key={index} className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom last-border-0">
                                            <div className="flex-grow-1">
                                                <div className="fw-bold small">{item.nombre}</div>
                                                {item.nro_parte && <div className="text-muted extra-small">N.P: {item.nro_parte}</div>}
                                                <div className="text-muted extra-small">Stock disp: {item.stock_actual}</div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center"
                                                    style={{ width: '60px' }}
                                                    min="1"
                                                    max={item.stock_actual}
                                                    value={item.cantidad_usada}
                                                    onChange={e => handleConsumedQtyChange(index, Number(e.target.value))}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger border-0"
                                                    onClick={() => handleRemoveConsumedItem(index)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {llevaSistematicos && (
                                <div className="mt-3 p-3 bg-light rounded border shadow-sm">
                                    <label className="form-label small fw-bold d-flex align-items-center gap-2">
                                        🔍 Stock Disponible
                                    </label>
                                    <div className="mb-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Filtrar por nombre o N/P..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="list-group overflow-auto" style={{ maxHeight: '200px', border: '1px solid #dee2e6' }}>
                                        {filteredWarehouseItems.length > 0 ? (
                                            filteredWarehouseItems.map((item: any) => {
                                                const isAlreadyAdded = formData.consumed_items.some(ci => ci.nombre === item.nombre && ci.nro_parte === item.nro_parte);
                                                return (
                                                    <button
                                                        key={item.key}
                                                        type="button"
                                                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center small py-2 ${isAlreadyAdded ? 'bg-light text-muted' : ''}`}
                                                        onClick={() => handleAddItem(item)}
                                                    >
                                                        <div>
                                                            <div className="fw-bold">{item.nombre}</div>
                                                            {item.nro_parte && <div className="extra-small opacity-75">N.P: {item.nro_parte}</div>}
                                                            {item.batchIds.length > 1 && <span className="badge bg-secondary extra-small ms-1">{item.batchIds.length} Lotes</span>}
                                                        </div>
                                                        <span className={`badge rounded-pill ${item.stock_actual <= 1 ? 'bg-danger' : 'bg-primary'}`}>
                                                            {item.stock_actual}
                                                        </span>
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <div className="p-3 text-center text-muted small">No hay ítems disponibles</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Registrando...' : 'Confirmar Registro'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
