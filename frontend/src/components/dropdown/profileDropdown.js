import React, { useState, useEffect } from "react";
import { Dropdown, Image } from "react-bootstrap";
import { BsPersonCircle, BsGear, BsBoxArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "./profileDropdown.css";
import defaultProfilePic from "../../logo.svg"; // Update this path to match your project structure
import axios from "../../config/configAxios";

function ProfileDropdown({ onLogout }) {
  const navigate = useNavigate();
  
  // Get current user type and all possible user types
  const currentUserType = sessionStorage.getItem("tipo");
  const userName = sessionStorage.getItem("nome");
  const userEmail = sessionStorage.getItem("email");
  const [profilePhoto, setProfilePhoto] = useState(null);
  
  const [userTypes, setUserTypes] = useState([]);
  const [activeType, setActiveType] = useState(currentUserType);
  const [show, setShow] = useState(false);

  // Add retry logic for image loading
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Function to fetch user profile data including the profile photo
  const fetchUserProfileData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token not found, cannot fetch profile photo");
        return;
      }
      
      // Fetch current user data
      const response = await axios.get('/colaborador/me');
      const userData = response.data;
      
      // Atualizar dados do usuário no sessionStorage
      if (userData.nome) sessionStorage.setItem("nome", userData.nome);
      if (userData.email) sessionStorage.setItem("email", userData.email);
      
      // Check if photo URL exists and is valid
      if (userData.fotoPerfilUrl && 
          userData.fotoPerfilUrl !== "undefined" && 
          userData.fotoPerfilUrl !== "null" && 
          userData.fotoPerfilUrl !== "") {
        // Verificar se a URL é válida
        try {
          const url = new URL(userData.fotoPerfilUrl);
          if (url.protocol === 'https:' || url.protocol === 'http:') {
            // Try to preload the image to check if it's accessible
            const img = new Image();
            img.onload = () => {
              setProfilePhoto(userData.fotoPerfilUrl);
            };
            img.onerror = () => {
              console.error("Failed to load profile image, using default");
              setProfilePhoto(null);
            };
            img.src = userData.fotoPerfilUrl;
          } else {
            console.error("Invalid URL protocol:", url.protocol);
            setProfilePhoto(null);
          }
        } catch (error) {
          console.error("Invalid URL format:", error);
          setProfilePhoto(null);
        }
      } else {
        setProfilePhoto(null);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfilePhoto(null);
      
      // Se o erro for 401 (não autorizado), fazer logout
      if (error.response && error.response.status === 401) {
        onLogout();
      }
    }
  };

  // Add retry logic for image loading
  const handleImageError = (e) => {
    console.error("Error loading profile image:", e);
    e.target.src = defaultProfilePic;
    
    // Implement retry logic
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        fetchUserProfileData();
      }, 2000 * (retryCount + 1)); // Exponential backoff
    } else {
      setProfilePhoto(null);
      setRetryCount(0);
    }
  };

  useEffect(() => {
    // Fetch user profile including photo on component mount
    fetchUserProfileData();
    
    // Create a custom event listener for profile updates
    const handleProfileUpdate = () => {
      fetchUserProfileData();
    };
    
    // Listen for custom profile-updated event
    window.addEventListener('profile-updated', handleProfileUpdate);
    
    // Set interval to periodically check for profile updates
    // This helps in case the event is missed or when the user refreshes just one component
    const profileCheckInterval = setInterval(() => {
      fetchUserProfileData();
    }, 60000); // Check every minute
    
    // Get all user types from session storage
    const allUserTypes = sessionStorage.getItem("allUserTypes");
    
    if (allUserTypes) {
      setUserTypes(allUserTypes.split(","));
    } else {
      // If allUserTypes isn't set, use the current type
      setUserTypes(currentUserType ? [currentUserType] : []);
    }
    
    setActiveType(currentUserType);

    // Cleanup event listener and interval
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
      clearInterval(profileCheckInterval);
    };
  }, [currentUserType]);

  const handleSwitchUserType = (type) => {
    sessionStorage.setItem("tipo", type);
    setActiveType(type);
    setShow(false);
    
    switch(type) {
      case "Formador":
        navigate("/formador/dashboard");
        break;
      case "Gestor":
        navigate("/gestor/dashboard");
        break;
      case "Formando":
        navigate("/utilizadores/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const hasMultipleRoles = userTypes.length > 1;

  // Custom toggle component to handle clicks manually
  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <div 
      ref={ref}
      className="profile-dropdown-toggle" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShow(!show);
      }}
    >
      <div className="profile-avatar">
        {profilePhoto ? (
          <Image 
            src={profilePhoto} 
            alt="Perfil" 
            roundedCircle 
            className="profile-image"
            onError={handleImageError}
          />
        ) : (
          <BsPersonCircle size={22} />
        )}
      </div>
    </div>
  ));

  // Custom menu component
  const CustomMenu = React.forwardRef(
    ({ children, style, className }, ref) => {
      return (
        <div
          ref={ref}
          style={{ ...style, display: show ? 'block' : 'none' }}
          className={`${className} profile-dropdown-menu`}
        >
          {children}
        </div>
      );
    },
  );

  return (
    <div className="profile-dropdown-container">
      <Dropdown 
        show={show}
        onToggle={(isOpen) => setShow(isOpen)}
        align="end"
      >
        <Dropdown.Toggle as={CustomToggle} id="dropdown-profile" />

        <Dropdown.Menu 
          as={CustomMenu} 
          className="profile-dropdown-menu" 
          popperConfig={{
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  rootBoundary: 'viewport',
                },
              },
            ],
          }}
        >
          <div className="profile-header">
            <div className="profile-info-container">
              {profilePhoto ? (
                <div className="dropdown-profile-image-container">
                  <Image 
                    src={profilePhoto} 
                    alt="Perfil" 
                    roundedCircle 
                    className="dropdown-profile-image"
                    onError={handleImageError}
                  />
                </div>
              ) : (
                <div className="dropdown-profile-icon">
                  <BsPersonCircle size={42} />
                </div>
              )}
              
              <div className="profile-info">
                <p className="profile-name">{userName || "Utilizador"}</p>
                <p className="profile-email">{userEmail || "email@exemplo.com"}</p>
                
                {hasMultipleRoles ? (
                  <div className="profile-roles-container">
                    <span className="roles-title">Mudar modo de visão</span>
                    <div className="roles-buttons">
                      {userTypes.map((type) => (
                        <span 
                          key={type} 
                          className={`profile-role ${type === activeType ? 'active-role' : ''}`}
                          onClick={() => handleSwitchUserType(type)}
                          title={type === activeType ? 'Modo ativo' : `Mudar para modo ${type}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  activeType && <span className="profile-role">{activeType}</span>
                )}
              </div>
            </div>
          </div>
          
          <Dropdown.Item 
            href="/utilizadores/perfil" 
            className="profile-menu-item"
            onClick={() => setShow(false)}
          >
            <BsPersonCircle className="menu-icon" /> Perfil
          </Dropdown.Item>
          <Dropdown.Item 
            href="/utilizadores/settings" 
            className="profile-menu-item"
            onClick={() => setShow(false)}
          >
            <BsGear className="menu-icon" /> Definições
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item 
            onClick={() => {
              setShow(false);
              onLogout();
            }} 
            className="profile-menu-item logout-item"
          >
            <BsBoxArrowRight className="menu-icon" /> Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default ProfileDropdown;