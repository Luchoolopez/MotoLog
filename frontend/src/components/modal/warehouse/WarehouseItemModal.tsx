import React, { useState, useEffect } from "react";
import { WarehouseService, type CreateWarehouseItemDto, type WarehouseItem } from "../../../services/warehouse.service";
import { useToast } from "../../../context/ToastContext";

interface Props {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: WarehouseItem | null;
    isRestock?: boolean;
}

export const WarehouseItemModal = ({ show, onClose, onSuccess, initialData, isRestock }: Props) => {
    const [formData, setFormData] = useState<CreateWarehouseItemDto>({
        nombre: '',
        categoria: 'Repuesto',
        fecha_compra: new Date().toISOString().split('T')[0],
        precio_compra: 0,
        cantidad: 0,
        nro_parte: '',
        lugar_compra: '',
        modelo_moto: '',
        observaciones: ''
    });

    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (show) {
            if (initialData) {
                if (isRestock) {
                    // Restock Mode: Keep constant info, reset variable info
                    setFormData({
                        nombre: initialData.nombre,
                        categoria: initialData.categoria,
                        // Reset variable fields
                        fecha_compra: new Date().toISOString().split('T')[0],
                        precio_compra: 0,
                        cantidad: 0,
                        nro_parte: initialData.nro_parte || '',
                        lugar_compra: '',
                        modelo_moto: initialData.modelo_moto || '',
                        observaciones: ''
                    });
                } else {
                    // Edit Mode: Load everything
                    setFormData({
                        nombre: initialData.nombre,
                        categoria: initialData.categoria,
                        fecha_compra: initialData.fecha_compra.split('T')[0],
                        precio_compra: initialData.precio_compra,
                        cantidad: initialData.cantidad,
                        nro_parte: initialData.nro_parte || '',
                        lugar_compra: initialData.lugar_compra || '',
                        modelo_moto: initialData.modelo_moto || '',
                        observaciones: initialData.observaciones || ''
                    });
                }
            } else {
                // Create Mode: Reset all
                setFormData({
                    nombre: '',
                    categoria: 'Repuesto',
                    fecha_compra: new Date().toISOString().split('T')[0],
                    precio_compra: 0,
                    cantidad: 0,
                    nro_parte: '',
                    lugar_compra: '',
                    modelo_moto: '',
                    observaciones: ''
                });
            }
        }
    }, [show, initialData, isRestock]);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData && !isRestock) {
                // Only update if it's NOT a restock
                await WarehouseService.update(initialData.id, formData);
                showToast('Item actualizado correctamente', 'success');
            } else {
                // Create new entry (for brand new or restock)
                await WarehouseService.create(formData);
                showToast(isRestock ? 'Re-ingreso registrado exitosamente' : 'Item agregado al almacén', 'success');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            showToast(error.message || 'Error al guardar el item', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block px-2" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                    <div className="modal-header bg-dark text-white" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <h5 className="modal-title">
                            {isRestock
                                ? '🔄 Re-ingreso de Stock'
                                : (initialData ? '📝 Editar Item' : '📦 Nuevo Item en Almacén')}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Nombre / Nomenclatura</label>
                                    <input
                                        type="text" className="form-control"
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Ej: Filtro de aceite, Pastillas de freno..."
                                        required autoFocus
                                        disabled={!!isRestock}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Categoría</label>
                                    <select
                                        className="form-select"
                                        value={formData.categoria}
                                        onChange={e => setFormData({ ...formData, categoria: e.target.value as any })}
                                        disabled={!!isRestock}
                                    >
                                        <option value="Repuesto">Repuesto</option>
                                        <option value="Accesorio">Accesorio</option>
                                        <option value="Sistemático">Sistemático</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Nro de Parte</label>
                                    <input
                                        type="text" className="form-control"
                                        value={formData.nro_parte}
                                        onChange={e => setFormData({ ...formData, nro_parte: e.target.value })}
                                        placeholder="Opcional"
                                        disabled={!!isRestock}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Fecha de Compra</label>
                                    <input
                                        type="date" className="form-control"
                                        value={formData.fecha_compra}
                                        onChange={e => setFormData({ ...formData, fecha_compra: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Precio de Compra</label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                            type="number" className="form-control"
                                            value={formData.precio_compra}
                                            onChange={e => setFormData({ ...formData, precio_compra: Number(e.target.value) })}
                                            onFocus={(e) => e.target.select()}
                                            min="0" step="0.01" required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Cantidad</label>
                                    <input
                                        type="number" className="form-control"
                                        value={formData.cantidad}
                                        onChange={e => setFormData({ ...formData, cantidad: Number(e.target.value) })}
                                        onFocus={(e) => e.target.select()}
                                        min="0" required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Lugar de Compra</label>
                                    <input
                                        type="text" className="form-control"
                                        value={formData.lugar_compra}
                                        onChange={e => setFormData({ ...formData, lugar_compra: e.target.value })}
                                        placeholder="Ej: Mercado Libre, Local..."
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Modelo Moto</label>
                                    <input
                                        type="text" className="form-control"
                                        value={formData.modelo_moto}
                                        onChange={e => setFormData({ ...formData, modelo_moto: e.target.value })}
                                        placeholder="Ej: MT-03, FZ-25..."
                                        disabled={!!isRestock}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Observaciones</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        value={formData.observaciones}
                                        onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                                        placeholder="Detalles adicionales..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bg-light" style={{ borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar en Almacén'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
