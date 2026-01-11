import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { useToast } from '../context/ToastContext';
import type { LicenseInsurance, CreateLicenseInsuranceDto } from '../services/licenseInsurance.service';
import { LicenseInsuranceService } from '../services/licenseInsurance.service';
import { MotoService } from '../services/moto.service';
import type { Motorcycle } from '../types/moto.types';

const PatentePage = () => {
    const [patentes, setPatentes] = useState<LicenseInsurance[]>([]);
    const [motos, setMotos] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<CreateLicenseInsuranceDto>({
        moto_id: 0,
        tipo: 'Patente',
        entidad: 'ARBA', // Default or generic
        nro_documento: '', // Can be used for "Boleta ID" or similar
        fecha_vencimiento: '',
        monto: 0,
        cuota: '',
        pagado: false,
        fecha_pago: '',
        observaciones: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [isAnnual, setIsAnnual] = useState(false);

    useEffect(() => {
        fetchData();
        fetchMotos();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await LicenseInsuranceService.getAll();
            // Filter only 'Patente' kind in case API returns mixed
            const filtered = data.filter((d: LicenseInsurance) => d.tipo === 'Patente');
            setPatentes(filtered);
        } catch (error) {
            console.error(error);
            showToast('Error al cargar patentes', 'error');
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

        // Client-side validation
        if (!formData.moto_id || formData.moto_id === 0) {
            showToast('Debes seleccionar una moto', 'error');
            return;
        }
        if (!formData.fecha_vencimiento) {
            showToast('La fecha de vencimiento es obligatoria', 'error');
            return;
        }

        try {
            // Prepare payload: convert empty strings to null for optional dates
            const payload = {
                ...formData,
                fecha_pago: formData.fecha_pago || null,
                cuota: formData.cuota || null,
                nro_documento: formData.nro_documento || '-'
            };

            if (isEditing && editId) {
                await LicenseInsuranceService.update(editId, payload);
                showToast('Patente actualizada', 'success');
            } else {
                await LicenseInsuranceService.create(payload as any);
                showToast('Patente registrada', 'success');
            }
            setShowModal(false);
            fetchData();
            resetForm();
        } catch (error: any) {
            console.error('Submit Error:', error);
            // Show more detailed error if available
            if (error.response && error.response.data) {
                console.error('Server Error Details:', error.response.data);
                const msg = error.response.data.message || error.response.data.error || 'Error al guardar';
                const details = error.response.data.details ? JSON.stringify(error.response.data.details) : '';
                showToast(`${msg} ${details}`, 'error');
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
            tipo: 'Patente',
            entidad: item.entidad,
            nro_documento: item.nro_documento,
            fecha_vencimiento: item.fecha_vencimiento,
            monto: item.monto,
            cuota: item.cuota || '',
            pagado: item.pagado,
            fecha_pago: item.fecha_pago || '',
            observaciones: item.observaciones || ''
        });
        setEditId(item.id);

        // Detect if it is annual
        const isAnualItem = item.cuota?.toUpperCase().includes('ANUAL');
        setIsAnnual(!!isAnualItem);

        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            moto_id: 0,
            tipo: 'Patente',
            entidad: 'ARBA',
            nro_documento: '',
            fecha_vencimiento: '',
            monto: 0,
            cuota: '',
            pagado: false,
            fecha_pago: '',
            observaciones: ''
        });
        setIsAnnual(false);
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

    const handleAnnualToggle = (checked: boolean) => {
        setIsAnnual(checked);
        if (checked) {
            const year = formData.fecha_vencimiento
                ? parseInt(formData.fecha_vencimiento.split('-')[0])
                : new Date().getFullYear();
            setFormData(prev => ({ ...prev, cuota: `ANUAL ${year}` }));
        } else {
            setFormData(prev => ({ ...prev, cuota: '' }));
        }
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
                        📄 Gestión de Patentes
                    </h2>
                    <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        + Nueva Patente
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
                                        <th className="py-3 bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Cuota</th>
                                        <th className="py-3 text-end bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Monto</th>
                                        <th className="py-3 text-center bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Estado</th>
                                        <th className="py-3 bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Fecha Pago</th>
                                        <th className="py-3 text-end pe-4 bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={7} className="text-center py-5">Cargando...</td></tr>
                                    ) : patentes.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-5 text-muted">No hay registros de patentes</td></tr>
                                    ) : (
                                        patentes.map(item => (
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
                                                <td><Badge bg="secondary" className="fw-normal">{item.cuota || 'N/A'}</Badge></td>
                                                <td className="text-end fw-bold">${Number(item.monto).toLocaleString()}</td>
                                                <td className="text-center">
                                                    {item.pagado ? (
                                                        <Badge bg="success">PAGADO</Badge>
                                                    ) : (
                                                        <Badge bg="danger">PENDIENTE</Badge>
                                                    )}
                                                </td>
                                                <td className="text-nowrap">
                                                    {item.pagado && item.fecha_pago ? new Date(item.fecha_pago).toLocaleDateString() : '-'}
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
                            ) : patentes.length === 0 ? (
                                <p className="text-center text-muted">No hay registros</p>
                            ) : (
                                patentes.map(item => (
                                    <Card key={item.id} className="mb-3 bg-secondary bg-opacity-25 border-secondary">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-warning fw-bold fs-5">
                                                    {new Date(item.fecha_vencimiento).toLocaleDateString()}
                                                </span>
                                                {item.pagado ? (
                                                    <Badge bg="success">PAGADO</Badge>
                                                ) : (
                                                    <Badge bg="danger">PENDIENTE</Badge>
                                                )}
                                            </div>
                                            <h5 className="card-title fw-bold mb-1">
                                                {item.moto?.marca} {item.moto?.modelo}
                                            </h5>
                                            <p className="text-white-50 small mb-2">{item.moto?.patente}</p>

                                            <div className="d-flex justify-content-between small text-white-50 mb-3">
                                                <span>Cuota: {item.cuota || 'N/A'}</span>
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
                    <Modal.Title>{isEditing ? 'Editar Patente' : 'Registrar Patente'}</Modal.Title>
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
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="mb-0">Cuota / Periodo</Form.Label>
                                        <div className="form-check form-switch small">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="annualSwitch"
                                                checked={isAnnual}
                                                onChange={e => handleAnnualToggle(e.target.checked)}
                                            />
                                            <label className="form-check-label text-info" htmlFor="annualSwitch" style={{ fontSize: '0.8rem' }}>Pago Anual</label>
                                        </div>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder={isAnnual ? "ANUAL 202X" : "Ej: 01/2026"}
                                        value={formData.cuota || ''}
                                        onChange={e => setFormData({ ...formData, cuota: e.target.value })}
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
                                    <Form.Label>Monto ($)</Form.Label>
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
                                            {formData.pagado ? 'Pagado' : 'Pendiente'}
                                        </label>
                                    </div>
                                </Form.Group>
                            </Col>

                            {formData.pagado && (
                                <Col md={12}>
                                    <div className="p-3 rounded bg-success bg-opacity-10 border border-success border-opacity-25 animated fadeIn">
                                        <Form.Group>
                                            <Form.Label className="text-success fs-small fw-bold">Fecha de Pago</Form.Label>
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

                            {/* Hidden fields defaults */}
                            <Col md={12} className="d-none">
                                <Form.Control
                                    type="text"
                                    value={formData.entidad}
                                    onChange={e => setFormData({ ...formData, entidad: e.target.value })}
                                    placeholder="Entidad Recaudadora"
                                />
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

export default PatentePage;
