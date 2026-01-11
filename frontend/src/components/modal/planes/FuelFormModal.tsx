import { useState, useEffect } from "react";
import { FuelService } from "../../../services/fuel.service";
import { useToast } from "../../../context/ToastContext";

interface Props {
    show: boolean;
    onClose: () => void;
    motoId: number;
    currentKm: number;
    initialData?: any; // To support editing
    onSuccess: () => void;
}

export const FuelFormModal = ({ show, onClose, motoId, currentKm, initialData, onSuccess }: Props) => {
    const isEdit = !!initialData;
    const [litros, setLitros] = useState<number | ''>('');
    const [precio, setPrecio] = useState<number | ''>('');
    const [empresa, setEmpresa] = useState('');
    const [kmMomento, setKmMomento] = useState<number>(currentKm);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        if (show) {
            if (initialData) {
                setLitros(initialData.litros);
                setPrecio(initialData.precio_por_litro);
                setEmpresa(initialData.empresa);
                setKmMomento(initialData.km_momento);
                // Usamos la parte de la fecha del string para evitar desfases de zona horaria
                setFecha(initialData.fecha.split('T')[0]);
            } else {
                setLitros('');
                setPrecio('');
                setEmpresa('');
                setKmMomento(currentKm);
                setFecha(new Date().toISOString().split('T')[0]);
            }
        }
    }, [show, initialData, currentKm]);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!litros || !precio || !empresa || !kmMomento) {
            showToast('Por favor completa todos los campos', 'error');
            return;
        }

        try {
            setLoading(true);
            const data = {
                moto_id: motoId,
                litros: Number(litros),
                precio_por_litro: Number(precio),
                total: (Number(litros) || 0) * (Number(precio) || 0),
                empresa,
                km_momento: kmMomento,
                fecha
            };

            if (isEdit) {
                await FuelService.update(initialData.id, data);
                showToast('Carga actualizada con éxito', 'success');
            } else {
                await FuelService.create(data);
                showToast('Carga registrada con éxito', 'success');
            }
            onSuccess();
            onClose();
            // Reset form
            setLitros('');
            setPrecio('');
            setEmpresa('');
        } catch (error: any) {
            showToast('Error al registrar combustible', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)' }}>
                    <div className={`modal-header ${isEdit ? 'bg-info' : 'bg-primary'} text-white`}>
                        <h5 className="modal-title">⛽ {isEdit ? 'Editar Carga de Combustible' : 'Registrar Carga de Combustible'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Fecha</label>
                                    <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">KM al momento</label>
                                    <input type="number" className="form-control" value={kmMomento} onChange={e => setKmMomento(Number(e.target.value))} required />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Litros</label>
                                    <input type="number" step="0.01" className="form-control" value={litros} onChange={e => setLitros(e.target.value === '' ? '' : Number(e.target.value))} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Precio por litro</label>
                                    <input type="number" step="0.01" className="form-control" value={precio} onChange={e => setPrecio(e.target.value === '' ? '' : Number(e.target.value))} required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Empresa (Estación de servicio)</label>
                                <input type="text" className="form-control" placeholder="Ej: YPF, Shell, Axion..." value={empresa} onChange={e => setEmpresa(e.target.value.toUpperCase())} required />
                            </div>
                            <div className="alert alert-secondary text-center mb-0">
                                <small>Costo Total:</small>
                                <h4 className="mb-0">${((Number(litros) || 0) * (Number(precio) || 0)).toLocaleString()}</h4>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Procesando...' : isEdit ? 'Actualizar Carga' : 'Registrar Carga'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
