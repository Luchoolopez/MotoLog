import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { useToast } from '../context/ToastContext';
import type { Fine, CreateFineDto } from '../types/fine.types';
import { FineService } from '../services/fine.service';
import { MotoService } from '../services/moto.service';
import type { Motorcycle } from '../types/moto.types';

const FinesPage = () => {
    const [fines, setFines] = useState<Fine[]>([]);
    const [motos, setMotos] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<CreateFineDto>({
        moto_id: 0,
        type: 'Multa',
        description: '',
        amount: 0,
        date: '',
        status: 'Pendiente',
        comments: ''
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
            const motoData = await MotoService.getAll();
            setMotos(motoData);

            let allFines: Fine[] = [];
            for (const m of motoData) {
                try {
                    const f = await FineService.getAllByMoto(m.id);
                    allFines = [...allFines, ...f];
                } catch (err) {
                    console.warn(`Could not fetch fines for moto ${m.id}`, err);
                }
            }
            setFines(allFines);
        } catch (error) {
            console.error("Error fetching data", error);
            showToast('Error al cargar datos. Verifica la conexión.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchMotos = async () => {
        // Already handled in fetchData, but let's keep it safe if we need to reload just motos
        try {
            const motoData = await MotoService.getAll();
            setMotos(motoData);
        } catch (error) {
            console.error("Error fetching motos", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.moto_id || formData.moto_id === 0) {
            showToast('Debes seleccionar una moto', 'error');
            return;
        }
        if (!formData.date) {
            showToast('La fecha es obligatoria', 'error');
            return;
        }

        try {
            if (isEditing && editId) {
                await FineService.update(editId, formData);
                showToast('Registro actualizado', 'success');
            } else {
                await FineService.create(formData);
                showToast('Registro creado', 'success');
            }
            setShowModal(false);
            fetchData(); // Reload
            resetForm();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data?.error || 'Error al guardar';
            showToast(`Error: ${msg}`, 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Seguro que deseas eliminar este registro?')) {
            try {
                await FineService.delete(id);
                showToast('Eliminado correctamente', 'success');
                fetchData();
            } catch (error) {
                console.error(error);
                showToast('Error al eliminar', 'error');
            }
        }
    };

    const handleEdit = (item: Fine) => {
        setFormData({
            moto_id: item.moto_id,
            type: item.type,
            description: item.description,
            amount: Number(item.amount),
            date: item.date,
            status: item.status,
            comments: item.comments || ''
        });
        setEditId(item.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            moto_id: 0,
            type: 'Multa',
            description: '',
            amount: 0,
            date: '',
            status: 'Pendiente',
            comments: ''
        });
        setIsEditing(false);
        setEditId(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pagado': return 'success';
            case 'Pendiente': return 'danger';
            case 'Apelado': return 'warning';
            case 'Anulado': return 'secondary';
            default: return 'secondary';
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
                        👮 Multas y Service
                    </h2>
                    <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        + Nuevo Registro
                    </Button>
                </div>

                <Card className="border-0 shadow-lg" style={{ backgroundColor: 'rgba(33, 37, 41, 0.95)' }}>
                    <Card.Body className="p-0">
                        {/* Desktop Table View */}
                        <div className="d-none d-md-block" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <Table hover variant="dark" className="mb-0 text-white">
                                <thead className="text-uppercase text-white-50 small bg-black">
                                    <tr>
                                        <th className="py-3 ps-4 bg-black">Fecha</th>
                                        <th className="py-3 bg-black">Moto</th>
                                        <th className="py-3 bg-black">Tipo</th>
                                        <th className="py-3 bg-black">Descripción</th>
                                        <th className="py-3 text-end bg-black">Monto</th>
                                        <th className="py-3 text-center bg-black">Estado</th>
                                        <th className="py-3 text-end pe-4 bg-black">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={7} className="text-center py-5">Cargando...</td></tr>
                                    ) : fines.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-5 text-muted">No hay registros</td></tr>
                                    ) : (
                                        fines.map(item => {
                                            const moto = motos.find(m => m.id === item.moto_id);
                                            return (
                                                <tr key={item.id} className="align-middle">
                                                    <td className="ps-4 text-warning fw-bold text-nowrap">
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        {moto ? (
                                                            <div className="d-flex flex-column">
                                                                <span className="fw-bold">{moto.marca} {moto.modelo}</span>
                                                                <small className="text-white-50">{moto.patente}</small>
                                                            </div>
                                                        ) : '-'}
                                                    </td>
                                                    <td><Badge bg="info" className="text-dark">{item.type}</Badge></td>
                                                    <td>{item.description}</td>
                                                    <td className="text-end fw-bold">${Number(item.amount).toLocaleString()}</td>
                                                    <td className="text-center">
                                                        <Badge bg={getStatusBadge(item.status)}>{item.status.toUpperCase()}</Badge>
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        <Button variant="link" className="text-info p-0 me-3" onClick={() => handleEdit(item)}>✏️</Button>
                                                        <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(item.id)}>🗑️</Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="d-md-none p-3">
                            {loading ? (
                                <p className="text-center">Cargando...</p>
                            ) : fines.length === 0 ? (
                                <p className="text-center text-muted">No hay registros</p>
                            ) : (
                                fines.map(item => {
                                    const moto = motos.find(m => m.id === item.moto_id);
                                    return (
                                        <Card key={item.id} className="mb-3 bg-secondary bg-opacity-25 border-secondary">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="text-warning fw-bold fs-5">
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </span>
                                                    <Badge bg={getStatusBadge(item.status)}>{item.status.toUpperCase()}</Badge>
                                                </div>
                                                <h5 className="card-title fw-bold mb-1">
                                                    {moto?.marca} {moto?.modelo}
                                                </h5>
                                                <p className="text-white-50 small mb-2">{moto?.patente}</p>

                                                <div className="mb-2">
                                                    <Badge bg="info" className="text-dark me-2">{item.type}</Badge>
                                                    <span>{item.description}</span>
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                                                    <span className="fw-bold fs-5">${Number(item.amount).toLocaleString()}</span>
                                                    <div>
                                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleEdit(item)}>Editar</Button>
                                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    )
                                })
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border border-secondary shadow-lg">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title>{isEditing ? 'Editar Registro' : 'Nuevo Registro'}</Modal.Title>
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
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        className="bg-secondary text-white border-0"
                                    >
                                        <option value="Multa">Multa</option>
                                        <option value="Service">Service</option>
                                        <option value="Otro">Otro</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Fecha</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: Exceso de velocidad, Renovación Licencia"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                        className="bg-secondary text-white border-0"
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Pagado">Pagado</option>
                                        <option value="Apelado">Apelado</option>
                                        <option value="Anulado">Anulado</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Comentarios</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={formData.comments}
                                        onChange={e => setFormData({ ...formData, comments: e.target.value })}
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

export default FinesPage;
