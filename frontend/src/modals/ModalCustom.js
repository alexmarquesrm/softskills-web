import React from 'react';
import { Modal, Container } from 'react-bootstrap';

const ModalCustom = ({ show, handleClose, title, children, size = 'lg' }) => {
  return (
    <Modal 
      show={show}
      onHide={handleClose}
      size={size}
      centered
      dialogClassName="custom-modal"
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: '#39639C',
          color: 'white',
        }}
      >
        <Modal.Title style={{ color: 'white' }}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: '#dbdbdb',
          maxHeight: '85vh',
          overflowY: 'auto',
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
          padding: 0,
        }}
      >
        <div
          style={{
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            overflowY: 'auto',
            maxHeight: '85vh',
            padding: '10px',
          }}
        >
          <Container>{children}</Container>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCustom;
