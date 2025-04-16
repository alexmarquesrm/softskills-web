import React from "react";
import Button from "react-bootstrap/Button";

function AddButton({ text, onClick, Icon, inline = false, variant = "outline-primary", size = "sm", className = "" }) {
  const buttonContent = (
    <Button variant={variant} size={size} onClick={onClick} className={`add-button d-inline-flex align-items-center gap-1 ${className}`} >
      {Icon && <Icon className="add-icon" />}
      <span>{text}</span>
    </Button>
  );
  
  return inline ? buttonContent : (
    <div className="add-button-container">
      {buttonContent}
    </div>
  );
}

export default AddButton;