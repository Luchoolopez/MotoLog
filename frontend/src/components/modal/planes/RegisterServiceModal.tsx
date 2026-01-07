import React, { useState, useEffect } from "react";
import type { CreateHistoryDto } from "../../../services/maintenanceHistory.service";
import { ItemService } from "../../../services/item.service";
import type { ItemPlan } from "../../../types/item.types";

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
        consumed_items: [] as { warehouse_item_id: number, cantidad_usada: number, nombre: string, nro_parte: string | null, stock_actual: number }[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (show && itemId) {
            const fetchItemDetails = async () => {
                try {
                    const item: ItemPlan = await ItemService.getById(itemId);
                    console.log("Item details fetched:", item);
                    if (item.items_almacen_asociados) {
                        setFormData(prev => ({
                            ...prev,
                            consumed_items: item.items_almacen_asociados?.map(wi => {
                                // Safe access to join table property
                                const joinData = (wi as any).item_plan_warehouse || (wi as any).ItemPlanWarehouse;
                                return {
                                    warehouse_item_id: wi.id,
                                    cantidad_usada: joinData?.cantidad_sugerida || 1,
                                    nombre: wi.nombre,
                                    nro_parte: wi.nro_parte || null,
                                    stock_actual: wi.stock_actual || 0
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

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newRecord: CreateHistoryDto = {
            moto_id: motoId,
            item_plan_id: itemId,
            fecha_realizado: formData.fecha_realizado,
            km_realizado: Number(formData.km_realizado),
            observaciones: formData.observaciones,
            consumed_items: formData.consumed_items.map(i => ({
                warehouse_item_id: i.warehouse_item_id,
                cantidad_usada: i.cantidad_usada
            }))
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
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center"
                                                    style={{ width: '60px' }}
                                                    min="1"
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
