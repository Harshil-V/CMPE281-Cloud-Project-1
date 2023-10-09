import { Navbar, Nav } from 'react-bootstrap';

const NavigationBar = (props) => {
    // eslint-disable-next-line react/prop-types
    const { userName, userID } = props;

    

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/">Logged In As: {userName} - ID:{userID}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/admin">Admin</Nav.Link>
                    <Nav.Link href="/upload">Upload File</Nav.Link>
                    <Nav.Link href="/delete">Delete File</Nav.Link>
                    <Nav.Link href="/update">Update File</Nav.Link>
                    <Nav.Link href="/download">Download File</Nav.Link>
                </Nav>
            </Navbar.Collapse>
           
        </Navbar>
    );
};

export default NavigationBar;
