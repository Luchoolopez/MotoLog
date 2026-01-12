import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { MotoService } from '../../../services/moto.service';
import { FuelService } from '../../../services/fuel.service';
import { LicenseInsuranceService } from '../../../services/licenseInsurance.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { FineService } from '../../../services/fine.service';
import type { Motorcycle } from '../../../types/moto.types';

interface FinancialReportModalProps {
    show: boolean;
    onHide: () => void;
}

export const FinancialReportModal: React.FC<FinancialReportModalProps> = ({ show, onHide }) => {
    const [motos, setMotos] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);

    // Filters
    const [selectedMotoId, setSelectedMotoId] = useState<number>(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [includeFuel, setIncludeFuel] = useState(true);
    const [includeInsurance, setIncludeInsurance] = useState(true);
    const [includePatente, setIncludePatente] = useState(true);
    const [includeVTV, setIncludeVTV] = useState(true);
    const [includeWarehouse, setIncludeWarehouse] = useState(true);
    const [includeFines, setIncludeFines] = useState(true);

    // Results
    const [totalCost, setTotalCost] = useState<number | null>(null);
    const [breakdown, setBreakdown] = useState({ fuel: 0, insurance: 0, patente: 0, vtv: 0, warehouse: 0, fines: 0 });

    useEffect(() => {
        if (show) {
            loadMotos();
            resetResults();
        }
    }, [show]);

    const loadMotos = async () => {
        try {
            setLoading(true);
            const data = await MotoService.getAll();
            setMotos(data);
        } catch (error) {
            console.error("Error loading motos", error);
        } finally {
            setLoading(false);
        }
    };

    const resetResults = () => {
        setTotalCost(null);
        setBreakdown({ fuel: 0, insurance: 0, patente: 0, vtv: 0, warehouse: 0, fines: 0 });
    };

    const handleCalculate = async () => {
        setCalculating(true);
        resetResults();

        let fuelTotal = 0;
        let insuranceTotal = 0;
        let patenteTotal = 0;
        let vtvTotal = 0;
        let warehouseTotal = 0;
        let finesTotal = 0;

        try {
            // 1. Calculate Fuel
            if (includeFuel) {
                let fuelRecords: any[] = [];
                if (selectedMotoId === 0) {
                    const promises = motos.map(m => FuelService.getByMotoId(m.id));
                    const results = await Promise.all(promises);
                    results.forEach(res => {
                        if (res && res.history) fuelRecords.push(...res.history);
                    });
                } else {
                    const res = await FuelService.getByMotoId(selectedMotoId);
                    if (res && res.history) fuelRecords = res.history;
                }
                fuelTotal = filterAndSum(fuelRecords, 'total', 'fecha');
            }

            // 2. Fetch Docs (Insurance & Patente & VTV)
            let docs: any[] = [];
            if (selectedMotoId === 0) {
                docs = await LicenseInsuranceService.getAll();
            } else {
                docs = await LicenseInsuranceService.getByMoto(selectedMotoId);
            }

            if (includeInsurance) {
                const insDocs = docs.filter(d => d.tipo === 'Seguro' && d.pagado);
                insuranceTotal = filterAndSum(insDocs, 'monto', 'fecha_pago');
            }
            if (includePatente) {
                const patDocs = docs.filter(d => d.tipo === 'Patente' && d.pagado);
                patenteTotal = filterAndSum(patDocs, 'monto', 'fecha_pago');
            }
            if (includeVTV) {
                const vtvDocs = docs.filter(d => d.tipo === 'VTV' && d.pagado);
                vtvTotal = filterAndSum(vtvDocs, 'monto', 'fecha_pago');
            }

            // 3. Warehouse
            if (includeWarehouse) {
                let warehouseItems = await WarehouseService.getAll();
                if (selectedMotoId !== 0) {
                    const selectedMoto = motos.find(m => m.id === selectedMotoId);
                    if (selectedMoto) {
                        warehouseItems = warehouseItems.filter(item => item.modelo_moto === selectedMoto.modelo);
                    }
                }
                // Custom sum logic for warehouse (price * qty)
                warehouseItems = filterByDate(warehouseItems, 'fecha_compra');
                warehouseTotal = warehouseItems.reduce((sum, item) => sum + (Number(item.precio_compra) * Number(item.cantidad)), 0);
            }

            // 4. Fines & Service
            if (includeFines) {
                let fineRecords: any[] = [];
                if (selectedMotoId === 0) {
                    for (const m of motos) {
                        try {
                            const f = await FineService.getAllByMoto(m.id);
                            fineRecords.push(...f);
                        } catch (e) { console.warn(e); }
                    }
                } else {
                    try {
                        fineRecords = await FineService.getAllByMoto(selectedMotoId);
                    } catch (e) { console.warn(e); }
                }
                // Filter only 'Pagado' or allow all? Typically 'Multas' might be pending. 
                // Requests usually imply "Spent", so maybe filter by status='Pagado'?
                // Or maybe the user wants to see debt? 
                // The report title is "Gastos". Usually implies spent money.
                // However, 'Service' is usually immediate.
                // Let's Include EVERYTHING for now, or maybe just non-anulated?
                // Let's include everything except 'Anulado'.
                fineRecords = fineRecords.filter(r => r.status !== 'Anulado');
                finesTotal = filterAndSum(fineRecords, 'amount', 'date');
            }

            setBreakdown({ fuel: fuelTotal, insurance: insuranceTotal, patente: patenteTotal, vtv: vtvTotal, warehouse: warehouseTotal, fines: finesTotal });
            setTotalCost(fuelTotal + insuranceTotal + patenteTotal + vtvTotal + warehouseTotal + finesTotal);

        } catch (error) {
            console.error("Error calculating expenses", error);
        } finally {
            setCalculating(false);
        }
    };

    // Helper to reduce code duplication
    const filterByDate = (items: any[], dateField: string) => {
        if (!startDate && !endDate) return items;
        return items.filter(item => {
            if (!item[dateField]) return false;
            const itemDate = new Date(item[dateField]);
            itemDate.setHours(0, 0, 0, 0);

            let valid = true;
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (itemDate < start) valid = false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);
                if (itemDate > end) valid = false;
            }
            return valid;
        });
    }

    const filterAndSum = (items: any[], amountField: string, dateField: string) => {
        const filtered = filterByDate(items, dateField);
        return filtered.reduce((sum, item) => sum + Number(item[amountField] || 0), 0);
    }

    return (
        <Modal show={show} onHide={onHide} centered size="lg" contentClassName="bg-dark text-white border border-secondary shadow-lg">
            <Modal.Header closeButton closeVariant="white" className="border-secondary">
                <Modal.Title>📊 Reporte de Gastos</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {/* Filters */}
                <div className="mb-4">
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Seleccionar Moto</Form.Label>
                        <Form.Select
                            value={selectedMotoId}
                            onChange={(e) => setSelectedMotoId(Number(e.target.value))}
                            className="bg-dark text-white border-secondary py-2"
                            disabled={loading}
                        >
                            <option value={0}>{loading ? 'Cargando motos...' : 'Todas las Motos'}</option>
                            {motos.map(m => (
                                <option key={m.id} value={m.id}>{m.marca} {m.modelo} - {m.patente}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Card className="bg-secondary bg-opacity-10 border-0 mb-4 rounded-3">
                        <Card.Body className="p-4">
                            {/* Global Date Filters */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="text-white-50 small">Fecha Desde</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="bg-dark text-white border-secondary"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="text-white-50 small">Fecha Hasta</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="bg-dark text-white border-secondary"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <h6 className="mb-4 text-warning fw-bold text-uppercase small letter-spacing-1 border-bottom border-secondary pb-2">
                                Categorías a Incluir
                            </h6>

                            <Row className="g-3">
                                <Col xs={6} md={3}>
                                    <Form.Check
                                        type="switch"
                                        id="fuel-switch"
                                        label="Combustible"
                                        checked={includeFuel}
                                        onChange={(e) => setIncludeFuel(e.target.checked)}
                                        className="fs-6 text-white"
                                    />
                                </Col>
                                <Col xs={6} md={3}>
                                    <Form.Check
                                        type="switch"
                                        id="insf-switch"
                                        label="Seguro"
                                        checked={includeInsurance}
                                        onChange={(e) => setIncludeInsurance(e.target.checked)}
                                        className="fs-6 text-white"
                                    />
                                </Col>
                                <Col xs={6} md={3}>
                                    <Form.Check
                                        type="switch"
                                        id="pat-switch"
                                        label="Patente"
                                        checked={includePatente}
                                        onChange={(e) => setIncludePatente(e.target.checked)}
                                        className="fs-6 text-white"
                                    />
                                </Col>
                                <Col xs={6} md={3}>
                                    <Form.Check
                                        type="switch"
                                        id="vtv-switch"
                                        label="VTV"
                                        checked={includeVTV}
                                        onChange={(e) => setIncludeVTV(e.target.checked)}
                                        className="fs-6 text-white"
                                    />
                                </Col>
                                <Col xs={6} md={3}>
                                    <Form.Check
                                        type="switch"
                                        id="warehouse-switch"
                                        label="Almacén"
                                        checked={includeWarehouse}
                                        onChange={(e) => setIncludeWarehouse(e.target.checked)}
                                        className="fs-6 text-white"
                                    />
                                </Col>
                                <Col xs={6} md={3}>
                                    <Form.Check
                                        type="switch"
                                        id="fines-switch"
                                        label="Multas y Sv"
                                        checked={includeFines}
                                        onChange={(e) => setIncludeFines(e.target.checked)}
                                        className="fs-6 text-white"
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <div className="d-grid">
                        <Button variant="primary" size="lg" onClick={handleCalculate} disabled={calculating} className="fw-bold py-3 shadow-sm">
                            {calculating ? <Spinner size="sm" animation="border" /> : '💰 Calcular Gastos'}
                        </Button>
                    </div>
                </div>

                {/* Results */}
                {totalCost !== null && (
                    <div className="animate__animated animate__fadeIn">
                        <hr className="border-secondary my-4" />
                        <div className="text-center mb-4">
                            <h4 className="text-white-50 mb-2 small text-uppercase letter-spacing-1">Gasto Total Estimado</h4>
                            <h1 className="display-4 fw-bold text-success" style={{ textShadow: '0 2px 10px rgba(25, 135, 84, 0.4)' }}>
                                ${totalCost.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h1>
                        </div>

                        <Row className="g-2 justify-content-center">
                            {/* Ordered compact cards */}
                            <Col xs={4} md={2}>
                                <Card className="bg-dark border border-danger h-100 shadow-sm" style={{ borderColor: '#dc3545' }}>
                                    <Card.Body className="text-center p-2">
                                        <small className="text-danger fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.65rem' }}>Combustible</small>
                                        <h6 className="fw-bold text-white mb-0">${breakdown.fuel.toLocaleString('es-AR')}</h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={4} md={2}>
                                <Card className="bg-dark border border-info h-100 shadow-sm" style={{ borderColor: '#0dcaf0' }}>
                                    <Card.Body className="text-center p-2">
                                        <small className="text-info fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.65rem' }}>Seguro</small>
                                        <h6 className="fw-bold text-white mb-0">${breakdown.insurance.toLocaleString('es-AR')}</h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={4} md={2}>
                                <Card className="bg-dark border border-warning h-100 shadow-sm" style={{ borderColor: '#ffc107' }}>
                                    <Card.Body className="text-center p-2">
                                        <small className="text-warning fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.65rem' }}>Patente</small>
                                        <h6 className="fw-bold text-white mb-0">${breakdown.patente.toLocaleString('es-AR')}</h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={4} md={2}>
                                <Card className="bg-dark border border-primary h-100 shadow-sm" style={{ borderColor: '#0d6efd' }}>
                                    <Card.Body className="text-center p-2">
                                        <small className="text-primary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.65rem' }}>VTV</small>
                                        <h6 className="fw-bold text-white mb-0">${breakdown.vtv.toLocaleString('es-AR')}</h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={4} md={2}>
                                <Card className="bg-dark border border-success h-100 shadow-sm" style={{ borderColor: '#198754' }}>
                                    <Card.Body className="text-center p-2">
                                        <small className="text-success fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.65rem' }}>Almacén</small>
                                        <h6 className="fw-bold text-white mb-0">${breakdown.warehouse.toLocaleString('es-AR')}</h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={4} md={2}>
                                <Card className="bg-dark border border-secondary h-100 shadow-sm" style={{ borderColor: '#adb5bd' }}>
                                    <Card.Body className="text-center p-2">
                                        <small className="text-white-50 fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.65rem' }}>Multas y Sv</small>
                                        <h6 className="fw-bold text-white mb-0">${breakdown.fines.toLocaleString('es-AR')}</h6>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer className="border-secondary">
                <Button variant="outline-light" onClick={onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};
