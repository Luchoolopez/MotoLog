import { Container, Row, Col, Card } from "react-bootstrap";
import React from "react";
import { useNavigate } from "react-router-dom";

export const ManagementPage = () => {
    const navigate = useNavigate();

    const options = [
        {
            title: "Patente",
            icon: "📄",
            description: "Gestiona los pagos y vencimientos de patentes",
            action: () => navigate('/management/patentes'),
            bgClass: "bg-primary",
            disabled: false
        },
        {
            title: "Seguro",
            icon: "🛡️",
            description: "Administra pólizas y comprobantes de seguro",
            action: () => navigate('/management/seguros'),
            bgClass: "bg-success",
            disabled: false
        },
        {
            title: "VTV",
            icon: "📋",
            description: "Control de Verificación Técnica Vehicular",
            action: () => navigate('/management/vtv'),
            bgClass: "bg-info",
            disabled: false
        }
    ];

    return (
        <div className="container-fluid flex-grow-1" style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/assets/garage-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            color: 'white'
        }}>
            <Container className="py-5">
                <h1 className="text-center mb-5 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    ⚙️ Gestión de Documentación
                </h1>

                <Row className="justify-content-center g-4">
                    {options.map((option, idx) => (
                        <Col key={idx} md={4} >
                            <Card
                                className="h-100 border-0 shadow-lg text-white"
                                style={{
                                    backgroundColor: 'rgba(33, 37, 41, 0.85)',
                                    backdropFilter: 'blur(5px)',
                                    cursor: option.disabled ? 'not-allowed' : 'pointer',
                                    transition: 'transform 0.2s',
                                    opacity: option.disabled ? 0.7 : 1
                                }}
                                onClick={option.disabled ? undefined : option.action}
                                onMouseOver={(e: React.MouseEvent<HTMLElement>) => !option.disabled && (e.currentTarget.style.transform = 'translateY(-5px)')}
                                onMouseOut={(e: React.MouseEvent<HTMLElement>) => !option.disabled && (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                <Card.Body className="text-center p-5 d-flex flex-column align-items-center justify-content-center">
                                    <div className="display-1 mb-3">{option.icon}</div>
                                    <h3 className="card-title fw-bold mb-3">{option.title}</h3>
                                    <p className="card-text text-white-50 mb-0">{option.description}</p>
                                    {option.disabled && <small className="text-warning mt-3 border border-warning rounded px-2 py-1">Próximamente</small>}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};
