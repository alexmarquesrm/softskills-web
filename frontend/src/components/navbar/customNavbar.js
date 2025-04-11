import React, { useState, useEffect } from "react";
import LoginModal from '../../modals/loginModal';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LuMenu } from "react-icons/lu";
import NavbarButton from "../buttons/navbarButton";
import Sidebar from "../sidebar/sidebar";
import "../navbar/navbar.css";

function CustomNavbar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount and when sessionStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      // Check if user is logged in by checking for token in sessionStorage
      const token = sessionStorage.getItem('token');
      setIsLoggedIn(!!token); // Convert to boolean: true if token exists, false otherwise
    };

    // Initial check
    checkLoginStatus();

    // Add event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      // Cleanup the event listener when component unmounts
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    // Close the modal
    setOpen(false);
    // Update login status
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
            {/* Only show login button if user is not logged in */}
            {!isLoggedIn && (
              <>
                <NavbarButton text="Login" onClick={handleOpen} />
                <LoginModal 
                  open={open} 
                  handleClose={handleClose} 
                  onLoginSuccess={handleLoginSuccess}
                />
              </>
            )}
          </div>
        </Container>
      </Navbar>
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
}

export default CustomNavbar;