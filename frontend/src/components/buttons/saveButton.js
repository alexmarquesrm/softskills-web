import React from "react";
import Button from "react-bootstrap/Button";

function guardar({ text, onClick, Icon, inline = false }) {
  const button = (
    <Button
      variant="primary"
      size="md"
      className="text-white d-flex align-items-center"
      onClick={onClick}
    >
      {Icon && <Icon className="me-2" />} 
      {text}
    </Button>
  );

  return inline ? button : (
    <div className="d-flex justify-content-center">
      {button}
    </div>
  );
}

export default guardar;


 

     
