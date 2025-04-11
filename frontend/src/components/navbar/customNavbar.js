import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../navbar/navbar.css";
import ProfileDropdown from "../profileDropdown";
import LoginModal from '../../modals/loginModal';
import NavbarButton from "../buttons/navbarButton";
import Sidebar from "../sidebar/sidebar";
import { LuMenu } from "react-icons/lu";

function CustomNavbar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoginSuccess = () => {
    setOpen(false);
    setIsLoggedIn(true);
  };

  return (
    <>
      <Navbar variant="dark" expand="lg" className="px-4 py-3" style={{ backgroundColor: "#39639C", minHeight: "60px" }} >
        <Container fluid className="d-flex align-items-center justify-content-between" >
          <Nav className="d-flex align-items-center">
            <Nav.Link onClick={() => setShowSidebar(true)} className="text-white d-flex align-items-center fs-5" >
              <LuMenu size={26} className="me-2 menu-icon" />
            </Nav.Link>
            <Nav.Link href="/" className="text-white fs-5 fw-bold"> Home </Nav.Link>
            <Nav.Link href="#" className="text-white fs-5"> Cursos </Nav.Link>
            <Nav.Link href="#" className="text-white fs-5"> Ajuda </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center">
            {!isLoggedIn ? (
              <>
                <NavbarButton text="Login" onClick={handleOpen} />
                <LoginModal
                  open={open}
                  handleClose={handleClose}
                  onLoginSuccess={handleLoginSuccess}
                />
              </>
            ) : (
              <ProfileDropdown
                imageUrl="https://via.placeholder.com/40"
                onLogout={() => {
                  sessionStorage.clear();
                  setIsLoggedIn(false);
                }}
              />
            )}
          </div>
        </Container>
      </Navbar>
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
}

export default CustomNavbar;