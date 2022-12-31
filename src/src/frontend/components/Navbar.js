import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import icon from './icon.png';

const Navigation = ({ web3Handler, account }) => {
    return (
        
        <Navbar className="theme-primary" expand="md"variant="dark">
            <Container>
                <Navbar.Brand href="#">
                    <img src={icon} width="40" height="40" className="" alt="" />
                    &nbsp; BLOCK TRANXACT
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/sell-item">Sell Item</Nav.Link>
                        <Nav.Link as={Link} to="/register-item">Register Item</Nav.Link>
                        <Nav.Link as={Link} to="/verify-item">Verify Item</Nav.Link>
                        <Nav.Link as={Link} to="/admin">Admin Mode</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account}
                                    {/* {account.slice(0, 5) + '...' + account.slice(38, 42)} */}
                                </Button>
                            </Nav.Link>
                        ) : (
                            <Button className="btn-connect" onClick={web3Handler}>Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;