import React from "react";
import Button from "react-bootstrap/Button";

function EditButton({ onClick, Icon }) {
  return (
    <Button
      variant="primary"
      size="sm"
      className="text-white d-flex align-items-center justify-content-center"
      style={{ minWidth: '36px', height: '36px' }}
      onClick={onClick}
    >
      {Icon && <Icon />}
    </Button>
  );
}

export default EditButton;
