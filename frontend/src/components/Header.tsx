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

                    {isAuthenticated && (
                        <Nav className="me-auto ms-3">
                            <Nav.Link as={Link} to="/" className="text-white text-uppercase small fw-bold mx-2">
                                🏠 Garage
                            </Nav.Link>
                            <Nav.Link as={Link} to="/warehouse" className="text-white text-uppercase small fw-bold mx-2">
                                📦 Almacén
                            </Nav.Link>
                        </Nav>
                    )}

                    {isAuthenticated && (
                        <div className="d-flex align-items-center ms-auto">
                            <span className="text-white me-3 d-none d-md-inline">Hola, {user?.name}</span>
                            <Button variant="outline-light" size="sm" onClick={logout}>
                                Cerrar Sesión
                            </Button>
                        </div>
                    )}
                </Container>
            </Navbar>

        </header>
    )
}