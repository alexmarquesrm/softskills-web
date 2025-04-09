import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LuMenu } from "react-icons/lu";
import NavbarButton from "../buttons/navbarButton";
import Sidebar from "../sidebar/sidebar";
import "../navbar/navbar.css";

function CustomNavbar() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
    <Navbar
      variant="dark"
      expand="lg"
      className="px-4 py-3"
      style={{ backgroundColor: "#39639C", minHeight: "60px" }}
    >
      <Container
        fluid
        className="d-flex align-items-center justify-content-between"
      >
        <Nav className="d-flex align-items-center">
          <Nav.Link onClick={() => setShowSidebar(true)} className="text-white d-flex align-items-center fs-5" >
              <LuMenu size={26} className="me-2 menu-icon" />
          </Nav.Link>
          <Nav.Link href="#" className="text-white fs-5 fw-bold"> Home </Nav.Link>
          <Nav.Link href="#" className="text-white fs-5"> Cursos </Nav.Link>
          <Nav.Link href="#" className="text-white fs-5"> Ajuda </Nav.Link>
        </Nav>

        <div className="d-flex align-items-center">
          <NavbarButton text="Login" onClick={() => alert("OLA")} />
        </div>
      </Container>
    </Navbar>
    <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} /> 
    </>
  );
}

export default CustomNavbar;
