import React from "react";
import Button from "react-bootstrap/Button";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function NavbarButton({text, onClick}) {
  return (
    <div className="d-flex justify-content-center mt-5">
      <Button
        variant="light"
        size="md"
        className="text-dark d-flex justify-content-between align-items-center"
        onClick={onClick}>
        {text}
        <FaUser className="ms-2" />
        </Button>
      </div>
    );
  }

  export default NavbarButton;
