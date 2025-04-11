
import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';

const ModalCustom = ({ show, handleClose, title, children, onSubmit, size = 'lg' }) => {
  return (
    <Modal show={show} onHide={handleClose} size={size} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#39639C', color: 'white' }}>
        <Modal.Title style={{ color: 'white' }}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>{children}</Container>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCustom;
