import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import NavbarButton from "../buttons/navbarButton"; 

function CustomNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Cursos</Nav.Link>
            <Nav.Link href="#">Ajuda</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <NavbarButton text="Login" onClick={()=> {alert("OLA")}} />
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
