import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { useToast } from '../context/ToastContext';
import type { LicenseInsurance, CreateLicenseInsuranceDto } from '../services/licenseInsurance.service';
import { LicenseInsuranceService } from '../services/licenseInsurance.service';
import { MotoService } from '../services/moto.service';
import type { Motorcycle } from '../types/moto.types';

const VTVPage = () => {
    const [registrers, setRegistrers] = useState<LicenseInsurance[]>([]);
    const [motos, setMotos] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<CreateLicenseInsuranceDto>({
        moto_id: 0,
        tipo: 'VTV',
        entidad: '', // Planta Verificadora
        nro_documento: '', // Oblea
        fecha_vencimiento: '',
        monto: 0,
        cobertura: '',
        cuota: '',
        pagado: false, // In context of VTV, this means "Realizada" (Done) although usually you pay when you do it.
        fecha_pago: '',
        observaciones: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
        fetchMotos();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await LicenseInsuranceService.getAll();
            const filtered = data.filter((d: LicenseInsurance) => d.tipo === 'VTV');
            setRegistrers(filtered);
        } catch (error) {
            console.error(error);
            showToast('Error al cargar VTVs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchMotos = async () => {
        try {
            const data = await MotoService.getAll();
            setMotos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.moto_id || formData.moto_id === 0) {
            showToast('Debes seleccionar una moto', 'error');
            return;
        }
        if (!formData.fecha_vencimiento) {
            showToast('La fecha de vencimiento es obligatoria', 'error');
            return;
        }

        try {
            const payload = {
                ...formData,
                fecha_pago: formData.fecha_pago || null,
                cuota: formData.cuota || null,
                cobertura: formData.cobertura || null,
                nro_documento: formData.nro_documento || '-'
            };

            if (isEditing && editId) {
                await LicenseInsuranceService.update(editId, payload);
                showToast('VTV actualizada', 'success');
            } else {
                await LicenseInsuranceService.create(payload as any);
                showToast('VTV registrada', 'success');
            }
            setShowModal(false);
            fetchData();
            resetForm();
        } catch (error: any) {
            console.error('Submit Error:', error);
            if (error.response && error.response.data) {
                const msg = error.response.data.message || 'Error al guardar';
                showToast(msg, 'error');
            } else {
                showToast('Error al guardar: ' + error.message, 'error');
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Seguro que deseas eliminar este registro?')) {
            try {
                await LicenseInsuranceService.delete(id);
                showToast('Eliminado correctamente', 'success');
                fetchData();
            } catch (error) {
                console.error(error);
                showToast('Error al eliminar', 'error');
            }
        }
    };

    const handleEdit = (item: LicenseInsurance) => {
        setFormData({
            moto_id: item.moto_id,
            tipo: 'VTV',
            entidad: item.entidad,
            nro_documento: item.nro_documento,
            fecha_vencimiento: item.fecha_vencimiento,
            monto: item.monto,
            cobertura: item.cobertura || '',
            cuota: item.cuota || '',
            pagado: item.pagado,
            fecha_pago: item.fecha_pago || '',
            observaciones: item.observaciones || ''
        });
        setEditId(item.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            moto_id: 0,
            tipo: 'VTV',
            entidad: '',
            nro_documento: '',
            fecha_vencimiento: '',
            monto: 0,
            cobertura: '',
            cuota: '',
            pagado: false,
            fecha_pago: '',
            observaciones: ''
        });
        setIsEditing(false);
        setEditId(null);
    };

    const handlePayToggle = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            pagado: checked,
            fecha_pago: checked ? new Date().toISOString().split('T')[0] : ''
        }));
    };

    return (
        <div className="container-fluid flex-grow-1" style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/assets/garage-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            color: 'white'
        }}>
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded shadow"
                    style={{ backgroundColor: 'rgba(33, 37, 41, 0.95)' }}>
                    <h2 className="mb-0 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        📋 Gestión de VTV
                    </h2>
                    <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        + Nueva VTV
                    </Button>
                </div>

                <Card className="border-0 shadow-lg" style={{ backgroundColor: 'rgba(33, 37, 41, 0.95)' }}>
                    <Card.Body className="p-0">
                        {/* Desktop Table View */}
                        <div className="d-none d-md-block" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <Table hover variant="dark" className="mb-0 text-white">
                                <thead className="text-uppercase text-white-50 small bg-black">
                                    <tr>
                                        <th className="py-3 ps-4 bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Vencimiento</th>
                                        <th className="py-3 bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Moto</th>
                                        <th className="py-3 bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Planta / Lugar</th>
                                        <th className="py-3 bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>N° Oblea</th>
                                        <th className="py-3 text-end bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Costo</th>
                                        <th className="py-3 text-center bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Estado</th>
                                        <th className="py-3 text-end pe-4 bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={7} className="text-center py-5">Cargando...</td></tr>
                                    ) : registrers.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-5 text-muted">No hay registros de VTV</td></tr>
                                    ) : (
                                        registrers.map(item => (
                                            <tr key={item.id} className="align-middle">
                                                <td className="ps-4 text-warning fw-bold text-nowrap">
                                                    {new Date(item.fecha_vencimiento).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {item.moto ? (
                                                        <div className="d-flex flex-column">
                                                            <span className="fw-bold">{item.moto.marca} {item.moto.modelo}</span>
                                                            <small className="text-white-50">{item.moto.patente}</small>
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                                <td>{item.entidad || '-'}</td>
                                                <td><Badge bg="light" text="dark" className="fw-normal">{item.nro_documento || '-'}</Badge></td>
                                                <td className="text-end fw-bold">${Number(item.monto).toLocaleString()}</td>
                                                <td className="text-center">
                                                    {item.pagado ? (
                                                        <Badge bg="success">REALIZADO</Badge>
                                                    ) : (
                                                        <Badge bg="danger">PENDIENTE</Badge>
                                                    )}
                                                </td>
                                                <td className="text-end pe-4">
                                                    <Button variant="link" className="text-info p-0 me-3" onClick={() => handleEdit(item)}>✏️</Button>
                                                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(item.id)}>🗑️</Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="d-md-none p-3">
                            {loading ? (
                                <p className="text-center">Cargando...</p>
                            ) : registrers.length === 0 ? (
                                <p className="text-center text-muted">No hay registros</p>
                            ) : (
                                registrers.map(item => (
                                    <Card key={item.id} className="mb-3 bg-secondary bg-opacity-25 border-secondary">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-warning fw-bold fs-5">
                                                    {new Date(item.fecha_vencimiento).toLocaleDateString()}
                                                </span>
                                                {item.pagado ? (
                                                    <Badge bg="success">REALIZADO</Badge>
                                                ) : (
                                                    <Badge bg="danger">PENDIENTE</Badge>
                                                )}
                                            </div>
                                            <h5 className="card-title fw-bold mb-1">
                                                {item.moto?.marca} {item.moto?.modelo}
                                            </h5>
                                            <p className="text-white-50 small mb-2">{item.moto?.patente}</p>

                                            <div className="d-flex justify-content-between small text-white-50 mb-3">
                                                <span>{item.entidad || '-'}</span>
                                                <span>Oblea: {item.nro_documento || '-'}</span>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                                                <span className="fw-bold fs-5">${Number(item.monto).toLocaleString()}</span>
                                                <div>
                                                    <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleEdit(item)}>Editar</Button>
                                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border border-secondary shadow-lg">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title>{isEditing ? 'Editar VTV' : 'Registrar VTV'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Moto</Form.Label>
                                    <Form.Select
                                        value={formData.moto_id}
                                        onChange={e => setFormData({ ...formData, moto_id: Number(e.target.value) })}
                                        required
                                        className="bg-secondary text-white border-0"
                                    >
                                        <option value={0}>Seleccionar Moto...</option>
                                        {motos.map(m => (
                                            <option key={m.id} value={m.id}>{m.marca} {m.modelo} - {m.patente}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Planta / Lugar</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: Planta Munro, CABA..."
                                        value={formData.entidad}
                                        onChange={e => setFormData({ ...formData, entidad: e.target.value.toUpperCase() })}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>N° Oblea / Certificado</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Opcional"
                                        value={formData.nro_documento}
                                        onChange={e => setFormData({ ...formData, nro_documento: e.target.value.toUpperCase() })}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Vencimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.fecha_vencimiento}
                                        onChange={e => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                                        required
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Costo ($)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.monto}
                                        onChange={e => setFormData({ ...formData, monto: Number(e.target.value) })}
                                        required
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Estado</Form.Label>
                                    <div className="form-check form-switch mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="pagadoSwitch"
                                            checked={formData.pagado}
                                            onChange={e => handlePayToggle(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="pagadoSwitch">
                                            {formData.pagado ? 'Realizada' : 'Pendiente'}
                                        </label>
                                    </div>
                                </Form.Group>
                            </Col>

                            {formData.pagado && (
                                <Col md={12}>
                                    <div className="p-3 rounded bg-success bg-opacity-10 border border-success border-opacity-25 animated fadeIn">
                                        <Form.Group>
                                            <Form.Label className="text-success fs-small fw-bold">Fecha de Realización</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formData.fecha_pago || ''}
                                                onChange={e => setFormData({ ...formData, fecha_pago: e.target.value })}
                                                required={formData.pagado}
                                                className="bg-dark text-white border-success"
                                            />
                                        </Form.Group>
                                    </div>
                                </Col>
                            )}

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Observaciones</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Notas adicionales..."
                                        value={formData.observaciones || ''}
                                        onChange={e => setFormData({ ...formData, observaciones: e.target.value.toUpperCase() })}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-secondary">
                        <Button variant="outline-light" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default VTVPage;
