import React from "react";
import Button from "react-bootstrap/Button";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginButton() {
  return (
    <div className="d-flex justify-content-center mt-5">
      <Button
        variant="light"
        size="md"
        className="text-dark"
        onClick={() => alert("Login clicked!")}
      >
        Login
        <FaUser className="ms-2" /> {/* Ícone de login */}
      </Button>
    </div>
  );
}

export default LoginButton;
