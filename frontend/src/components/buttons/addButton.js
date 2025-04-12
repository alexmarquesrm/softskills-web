import React from "react";
import Button from "react-bootstrap/Button";

function addButton({ text, onClick, Icon, inline = false }) {
  const button = (
    <Button
      variant="primary" 
      size="md"
      className="text-white d-flex justify-content-between align-items-center"
      onClick={onClick}
    >
      {text} 
      {Icon && <Icon className="ms-2" />}
    </Button>
  );

  return inline ? button : (
    <div className="d-flex justify-content-center">
      {button}
    </div>
  );
}

export default addButton;