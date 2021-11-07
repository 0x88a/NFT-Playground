
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { Form, FormControl, Button } from 'react-bootstrap'

export default function Navb({theme}) {
    return (
        <Navbar bg={theme} variant={theme} expand="lg">
            <Container fluid>
                <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="#action1">Home</Nav.Link>
                        <Nav.Link href="#" disabled>
                            Link
                        </Nav.Link>
                    </Nav>
                    <Button variant="primary">Connect</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}