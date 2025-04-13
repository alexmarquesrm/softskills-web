import React from "react";
import { Dropdown, Image } from "react-bootstrap";
import { BsPersonCircle, BsGear, BsBoxArrowRight } from "react-icons/bs";
import "./profileDropdown.css";

function ProfileDropdown({ onLogout }) {
  const userType = sessionStorage.getItem("tipo");
  const userName = sessionStorage.getItem("nome")
  const userEmail = sessionStorage.getItem("email")

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="link" id="dropdown-profile" className="profile-dropdown-toggle" >
        <div className="profile-avatar">
          <BsPersonCircle size={22} />
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="profile-dropdown-menu">
        <div className="profile-header">
          <div className="profile-info">
            <p className="profile-name">{userName}</p>
            <p className="profile-email">{userEmail}</p>
            {userType && <span className="profile-role">{userType}</span>}
          </div>
        </div>
        <Dropdown.Divider />
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