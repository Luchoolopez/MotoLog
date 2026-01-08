import { Container, Navbar, Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="header sticky-top border-bottom border-2">
            <Navbar expand="lg" className="py-3 bg-black" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/" className="titulo fw-bold fs-1">
                        MotoLog
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        {isAuthenticated && (
                            <Nav className="me-auto ms-lg-3">
                                <Nav.Link as={Link} to="/" className="text-white text-uppercase small fw-bold mx-2 py-2 py-lg-0">
                                    🏠 Garage
                                </Nav.Link>
                                <Nav.Link as={Link} to="/warehouse" className="text-white text-uppercase small fw-bold mx-2 py-2 py-lg-0">
                                    📦 Almacén
                                </Nav.Link>
                                <Nav.Link as={Link} to="/documents" className="text-white text-uppercase small fw-bold mx-2 py-2 py-lg-0">
                                    📄 Patente/Seguro
                                </Nav.Link>
                            </Nav>
                        )}

                        {isAuthenticated && (
                            <div className="d-flex align-items-center ms-auto pt-3 pt-lg-0 border-top border-secondary border-lg-0">
                                <span className="text-white me-3 d-none d-lg-inline">Hola, {user?.name}</span>
                                <Button variant="outline-light" size="sm" onClick={logout} className="w-100 w-lg-auto">
                                    Cerrar Sesión
                                </Button>
                            </div>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </header>
    )
}