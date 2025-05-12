import React from "react";
import Button from "react-bootstrap/Button";

function CancelButton({ text, onClick, Icon, inline = false }) {
  const button = (
    <Button
      variant="outline-primary"
      size="md"
      className={`text-primary d-flex justify-content-between align-items-center border-2 text-decoration-none me-4`} 
      onClick={onClick}
      style={{
        borderColor: "#007bff",  
        backgroundColor: "transparent",  
      }}

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

export default CancelButton;
