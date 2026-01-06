import { Container, Navbar, Button } from "react-bootstrap";
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
                        <div className="d-flex align-items-center ms-auto">
                            <span className="text-white me-3">Hola, {user?.name}</span>
                            <Button variant="outline-light" onClick={logout}>
                                Cerrar Sesión
                            </Button>
                        </div>
                    )}
                </Container>
            </Navbar>

        </header>
    )
}