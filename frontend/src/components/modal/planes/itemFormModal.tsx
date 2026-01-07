import React, { useState, useEffect } from "react";
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
        intervalo_km: 0 as string | number,
        intervalo_meses: 0 as string | number,
        associated_items: [] as { warehouse_item_id: number, cantidad_sugerida: number }[]
    });
    const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (show) {
            const fetchWarehouse = async () => {
                try {
                    const items = await WarehouseService.getAll();
                    setWarehouseItems(items);
                } catch (error) {
                    console.error("Error fetching warehouse items", error);
                }
            };
            fetchWarehouse();
        }
    }, [show]);

    const handleAddAssociatedItem = () => {
        setFormData({
            ...formData,
            associated_items: [...formData.associated_items, { warehouse_item_id: 0, cantidad_sugerida: 1 }]
        });
    };

    const handleRemoveAssociatedItem = (index: number) => {
        const newItems = [...formData.associated_items];
        newItems.splice(index, 1);
        setFormData({ ...formData, associated_items: newItems });
    };

    const handleAssociatedItemChange = (index: number, field: string, value: any) => {
        const newItems = [...formData.associated_items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, associated_items: newItems });
    };

    const { showToast } = useToast();

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.tarea.trim()) return showToast("La tarea es obligatoria", 'warning');

        setIsSubmitting(true);

        const newItem: CreateItemDto = {
            plan_id: planId,
            tarea: formData.tarea,
            intervalo_km: Number(formData.intervalo_km),
            intervalo_meses: Number(formData.intervalo_meses),
            associated_items: formData.associated_items.filter(i => i.warehouse_item_id > 0)
        };

        const success = await onSubmit(newItem);

        setIsSubmitting(false);

        if (success) {
            setFormData({ tarea: '', intervalo_km: 0, intervalo_meses: 0, associated_items: [] });
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
                                    onChange={e => setFormData({ ...formData, tarea: e.target.value })}
                                    autoFocus required
                                />
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
                                        required
                                    />
                                </div>
                            </div>

                            <hr />
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label fw-bold mb-0">Sistemáticos / Consumibles (Opcional)</label>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={handleAddAssociatedItem}
                                    >
                                        + Agregar
                                    </button>
                                </div>
                                {formData.associated_items.map((item, index) => (
                                    <div key={index} className="row g-2 mb-2 align-items-end border p-2 rounded bg-light">
                                        <div className="col-7">
                                            <label className="small text-muted">Item del Almacén</label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={item.warehouse_item_id}
                                                onChange={e => handleAssociatedItemChange(index, 'warehouse_item_id', Number(e.target.value))}
                                                required
                                            >
                                                <option value="0">Seleccionar ítem...</option>
                                                {warehouseItems.map(wi => (
                                                    <option key={wi.id} value={wi.id}>
                                                        {wi.nombre} ({wi.categoria}) - Stock: {wi.stock_actual}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <label className="small text-muted">Cant.</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                min="1"
                                                value={item.cantidad_sugerida}
                                                onChange={e => handleAssociatedItemChange(index, 'cantidad_sugerida', Number(e.target.value))}
                                                required
                                            />
                                        </div>
                                        <div className="col-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger w-100"
                                                onClick={() => handleRemoveAssociatedItem(index)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {formData.associated_items.length === 0 && (
                                    <p className="text-muted small text-center mb-0">No hay ítems asociados a esta regla.</p>
                                )}
                            </div>
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