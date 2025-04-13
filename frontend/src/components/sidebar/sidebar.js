import React, { useState } from "react";
import { Accordion} from "react-bootstrap";
import { Gear, Flag, EnvelopeOpen, PersonCircle, BoxArrowRight, Book, PeopleFill, Building, Grid } from "react-bootstrap-icons";
import "./sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const tipoUtilizador = sessionStorage.getItem("tipo");
  const [activeItem, setActiveItem] = useState("");

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  const NavItem = ({ href, icon, label, itemName }) => (
    <a 
      href={href} 
      className={`sidebar-item ${activeItem === itemName ? 'active' : ''}`}
      onClick={() => handleItemClick(itemName)}
    >
      <div className="sidebar-icon">{icon}</div>
      <span className="sidebar-label">{label}</span>
    </a>
  );

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <div className={`custom-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <h3>
            <span className="brand-text-dark">Soft</span>
            <span className="brand-text-accent">Skills</span>
          </h3>
        </div>

        <div className="sidebar-menu">
          {tipoUtilizador === "Gestor" && (
            <>
              <div className="menu-section">
                <span className="menu-heading">PRINCIPAIS</span>
                <Accordion className="sidebar-accordion">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="sidebar-accordion-header">
                      <div className="sidebar-icon">
                        <Gear size={18} />
                      </div>
                      <span>Gestão</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <NavItem href="/gestor/lista/cursos" icon={<Book size={16} />} label="Gerir Cursos" itemName="cursos" />
                      <NavItem href="/gestor/lista/colaboradores" icon={<PeopleFill size={16} />} label="Gerir Colaboradores" itemName="colaboradores" />
                      <NavItem href="/gestor/lista/departamentos" icon={<Building size={16} />} label="Gerir Departamentos" itemName="departamentos" />
                      <NavItem href="/gestor/lista/funcoes" icon={<Gear size={16} />} label="Gerir Funções" itemName="funcoes" />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <NavItem href="/gestor/lista/denuncias" icon={<Flag size={18} />} label="Ver Denúncias" itemName="denuncias" />
                <NavItem href="/gestor/lista/pedidos" icon={<EnvelopeOpen size={18} />} label="Ver Pedidos" itemName="pedidos" />
              </div>
            </>
          )}

          {tipoUtilizador === "Formando" && (
            <>
            <div className="menu-section">
              <span className="menu-heading">PRINCIPAIS</span>
              <Accordion className="sidebar-accordion">
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="sidebar-accordion-header">
                    <div className="sidebar-icon">
                      <Gear size={18} />
                    </div>
                    <span>Categorias</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <NavItem href="/" icon={<Book size={16} />} label="diversas categorias" itemName="cursos" />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <NavItem href="/" icon={<Flag size={18} />} label="Percurso Formativo" itemName="denuncias" />
              <NavItem href="/" icon={<EnvelopeOpen size={18} />} label="Fórum" itemName="pedidos" />
            </div>
          </>
          )}

        {!tipoUtilizador && (
            <>
              <div className="menu-section">
                <span className="menu-heading">EXPLORAR</span>
                <Accordion className="sidebar-accordion">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="sidebar-accordion-header">
                      <div className="sidebar-icon">
                        <Grid size={18} />
                      </div>
                      <span>Categorias</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <NavItem href="/categorias" icon={<Book size={16} />} label="Ver todas" itemName="todas-categorias" />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="menu-section">
            <span className="menu-heading">CONTA</span>
            <NavItem href="/utilizadores/perfil" icon={<PersonCircle size={18} />} label="Perfil" itemName="perfil" />
            <NavItem href="/logout" icon={<BoxArrowRight size={18} />} label="Logout" itemName="logout" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;