import React from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";


function Botao({ text, onClick, Icon }) {
  return (
    <div className="d-flex justify-content-center">
      <Button
        variant="primary" 
        size="md"
        className="text-white d-flex justify-content-between align-items-center"
        onClick={onClick}
      >
        {text} 
        {Icon && <Icon className="ms-2" />}
      </Button>
    </div>
  ); 
}

export default Botao;

