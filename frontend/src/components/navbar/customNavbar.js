import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import "../navbar/navbar.css";
import ProfileDropdown from "../dropdown/profileDropdown";
import LoginModal from '../../modals/loginModal';
import NavbarButton from "../buttons/navbarButton";
import Sidebar from "../sidebar/sidebar";
import { LuMenu} from "react-icons/lu";
import { FaGraduationCap } from "react-icons/fa";
import NotificationDropdown from '../notifications/NotificationDropdown';

function CustomNavbar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('token');
      const isLoggedOut = localStorage.getItem('isLoggedOut');
      const currentToken = localStorage.getItem('currentToken');
      const storedUserType = sessionStorage.getItem('tipo');
      
      // Primeiro verifica se há um token no localStorage
      if (currentToken) {
        // Se não houver token no sessionStorage, copia do localStorage
        if (!token) {
          sessionStorage.setItem('token', currentToken);
          setIsLoggedIn(true);
          setUserType(storedUserType);
          return;
        }
        // Se já houver token no sessionStorage, mantém o estado
        setIsLoggedIn(true);
        setUserType(storedUserType);
        return;
      }

      // Se não houver token no localStorage, verifica se é um logout
      if (isLoggedOut === 'true') {
        sessionStorage.clear();
        localStorage.removeItem('isLoggedOut');
        localStorage.removeItem('currentToken');
        setIsLoggedIn(false);
        setUserType(null);
        navigate('/login');
        return;
      }
      
      // Se não houver token em nenhum lugar, está deslogado
      setIsLoggedIn(false);
      setUserType(null);
    };

    // Check initial login status
    checkLoginStatus();

    // Listen for storage changes (other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedOut' || e.key === 'currentToken' || e.key === 'tipo') {
        checkLoginStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for session expiration
    const handleSessionExpired = () => {
      sessionStorage.clear();
      localStorage.setItem('isLoggedOut', 'true');
      localStorage.removeItem('currentToken');
      setIsLoggedIn(false);
      setUserType(null);
      navigate('/login');
    };
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    
    // Add scroll listener for navbar shadow effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoginSuccess = () => {
    setOpen(false);
    const token = sessionStorage.getItem('token');
    const userType = sessionStorage.getItem('tipo');
    if (token) {
      localStorage.setItem('currentToken', token);
      setIsLoggedIn(true);
      setUserType(userType);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.setItem('isLoggedOut', 'true');
    localStorage.removeItem('currentToken');
    setIsLoggedIn(false);
    setUserType(null);
    // Disparar evento para outras abas
    window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
    navigate('/');
  };

  const handleDashboardRedirect = () => {
    if (!userType) return;
    
    switch (userType.toLowerCase()) {
      case 'gestor':
        navigate('/gestor/dashboard');
        break;
      case 'formando':
        navigate('/utilizadores/dashboard');
        break;
      case 'formador':
        navigate('/formador/dashboard');
        break;
      default:
        navigate('/');
    }
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
              {isLoggedIn && (
                <Nav.Link onClick={handleDashboardRedirect} className="nav-link-custom">
                  Dashboard
                </Nav.Link>
              )}
              {userType?.toLowerCase() === 'formando' && (
                <Nav.Link href="/utilizadores/lista/cursos" className="nav-link-custom">
                  <FaGraduationCap className="nav-icon" /> Cursos
                </Nav.Link>
              )}
              {!isLoggedIn && (
                <Nav.Link href="/cursos-view" className="nav-link-custom">
                  <FaGraduationCap className="nav-icon" /> Cursos
                </Nav.Link>
              )}
            </Nav>
          </div>

          <div className="d-flex align-items-center">
            {!isLoggedIn ? (
              <>
                <NavbarButton text="Login" onClick={handleOpen} />
                <LoginModal open={open} handleClose={handleClose} onLoginSuccess={handleLoginSuccess} />
              </>
            ) : (
              <>
                <NotificationDropdown />
                <ProfileDropdown onLogout={handleLogout} />
              </>
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