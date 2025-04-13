import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import "../navbar/navbar.css";
import ProfileDropdown from "../profileDropdown";
import LoginModal from '../../modals/loginModal';
import NavbarButton from "../buttons/navbarButton";
import Sidebar from "../sidebar/sidebar";
import { LuMenu, LuSearch } from "react-icons/lu";
import { BsQuestionCircle } from "react-icons/bs";
import { FaGraduationCap } from "react-icons/fa";

function CustomNavbar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    
    // Add scroll listener for navbar shadow effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('scroll', handleScroll);
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
      <Navbar 
        variant="dark" 
        expand="lg" 
        fixed="top"
        className={`custom-navbar px-4 py-2 ${scrolled ? 'navbar-scrolled' : ''}`}
      >
        <Container fluid className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Nav.Link 
              onClick={() => setShowSidebar(true)} 
              className="text-white d-flex align-items-center nav-icon-link me-3"
            >
              <LuMenu size={24} className="menu-icon" />
            </Nav.Link>
            
            <Navbar.Brand href="/" className="brand-logo me-4">
              <span className="brand-text-light">Soft</span>
              <span className="brand-text-accent">Skills</span>
            </Navbar.Brand>
            
            <Nav className="me-auto d-none d-lg-flex">
              <Nav.Link href="/" className="nav-link-custom">Home</Nav.Link>
              <Nav.Link href="/cursos" className="nav-link-custom">
                <FaGraduationCap className="nav-icon" /> Cursos
              </Nav.Link>
              <Nav.Link href="/ajuda" className="nav-link-custom">
                <BsQuestionCircle className="nav-icon" /> Ajuda
              </Nav.Link>
            </Nav>
          </div>

          <div className="d-flex align-items-center">
            <div className="search-box-container me-3 d-none d-md-block">
              <div className="search-box">
                <input type="text" placeholder="Pesquisar..." className="search-input" />
                <LuSearch className="search-icon" />
              </div>
            </div>
            
            {!isLoggedIn ? (
              <>
                <NavbarButton text="Login" onClick={handleOpen} />
                <LoginModal open={open} handleClose={handleClose} onLoginSuccess={handleLoginSuccess} />
              </>
            ) : (
              <ProfileDropdown onLogout={() => {
                sessionStorage.clear();
                setIsLoggedIn(false);
                navigate('/');
              }} />
            )}
          </div>
        </Container>
      </Navbar>
      <div className="navbar-spacer"></div>
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
}

export default CustomNavbar;