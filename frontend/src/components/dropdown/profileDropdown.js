import React, { useState, useEffect } from "react";
import { Dropdown, Image, Badge } from "react-bootstrap";
import { BsPersonCircle, BsGear, BsBoxArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "./profileDropdown.css";

function ProfileDropdown({ onLogout }) {
  const navigate = useNavigate();
  
  // Get current user type and all possible user types
  const currentUserType = sessionStorage.getItem("tipo");
  const userName = sessionStorage.getItem("nome");
  const userEmail = sessionStorage.getItem("email");
  
  const [userTypes, setUserTypes] = useState([]);
  const [activeType, setActiveType] = useState(currentUserType);

  useEffect(() => {
    // Get all user types from session storage (assuming it's stored as comma-separated string)
    const allUserTypes = sessionStorage.getItem("allUserTypes");
    
    if (allUserTypes) {
      setUserTypes(allUserTypes.split(","));
    } else {
      // If allUserTypes isn't set, use the current type
      setUserTypes(currentUserType ? [currentUserType] : []);
    }
    
    setActiveType(currentUserType);
  }, [currentUserType]);

  const handleSwitchUserType = (type) => {
    sessionStorage.setItem("tipo", type);
    setActiveType(type);
    
    switch(type) {
      case "Formador":
        navigate("/formador/dashboard");
        break;
      case "Gestor":
        navigate("/gestor/dashboard");
        break;
      case "Formando":
        navigate("/formando/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const hasMultipleRoles = userTypes.length > 1;

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="link" id="dropdown-profile" className="profile-dropdown-toggle">
        <div className="profile-avatar">
          <BsPersonCircle size={22} />
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="profile-dropdown-menu">
        <div className="profile-header">
          <div className="profile-info">
            <p className="profile-name">{userName}</p>
            <p className="profile-email">{userEmail}</p>
            
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
        
        <Dropdown.Item href="/utilizadores/perfil" className="profile-menu-item">
          <BsPersonCircle className="menu-icon" /> Perfil
        </Dropdown.Item>
        <Dropdown.Item href="/utilizadores/settings" className="profile-menu-item">
          <BsGear className="menu-icon" /> Definições
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={onLogout} className="profile-menu-item logout-item">
          <BsBoxArrowRight className="menu-icon" /> Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfileDropdown;