import React from "react";
import { Dropdown, Image } from "react-bootstrap";

function ProfileDropdown({ imageUrl, onLogout }) {
  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="link"
        id="dropdown-profile"
        className="p-0 border-0"
        style={{ background: "none", boxShadow: "none" }}
      >
        <Image
          src={imageUrl || "https://via.placeholder.com/40"}
          roundedCircle
          width="40"
          height="40"
          alt="Profile"
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/perfil">Perfil</Dropdown.Item>
        <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfileDropdown;
