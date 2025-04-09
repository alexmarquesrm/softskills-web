// src/components/sidebar/sidebar.js
import React from "react";
import { Nav } from "react-bootstrap";
import { House, Grid, Book, ChatDots, PersonCircle, BoxArrowRight} from "react-bootstrap-icons";
import "./sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

    <div className={`custom-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header d-flex justify-content-between align-items-center">
        <h4>
          <span style={{ color: "#4a4a4a" }}>Soft</span>
          <span style={{ color: "#00bfff" }}>Skills</span>
        </h4>
      </div>
      <Nav className="flex-column mt-4 flex-grow-1">
        <Nav.Link href="/" className="sidebar-item inicio">
          <House className="me-2" /> Início 
        </Nav.Link>
        <Nav.Link href="/categorias" className="sidebar-item categorias">
          <Grid className="me-2" /> Categorias
        </Nav.Link>
        <Nav.Link href="/formativo" className="sidebar-item percurso">
          <Book className="me-2" /> Percurso Formativo
        </Nav.Link>
        <Nav.Link href="/forum" className="sidebar-item forum">
          <ChatDots className="me-2" /> Fórum
        </Nav.Link>
      </Nav>

      <div className="sidebar-footer mt-auto">
        <Nav className="flex-column">
          <Nav.Link href="/utilizadores/perfil" className="sidebar-item perfil">
            <PersonCircle className="me-2" /> Perfil
          </Nav.Link>
          <Nav.Link href="/logout" className="sidebar-item logout">
            <BoxArrowRight className="me-2" /> Logout
          </Nav.Link>
        </Nav>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
