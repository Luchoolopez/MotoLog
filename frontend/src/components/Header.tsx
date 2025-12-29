import { Container, Navbar } from "react-bootstrap";

export const Header: React.FC = () => {
    return (
        <header className="header sticky-top border-bottom border-2">
            <Navbar expand="lg" className="py-3 bg-black" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/" className="titulo fw-bold fs-1">
                        MotoLog
                    </Navbar.Brand>

                    {/*
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end fs-4">
                        <Nav className="menu align-items-center gap-2">
                            <Nav.Link href="/calendario">Crear nuevo plan</Nav.Link>
                            <Button>Crear nueva moto</Button>
                        </Nav>
                    </Navbar.Collapse>
                    */}
                </Container>
            </Navbar>

        </header>
    )
} 