import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';

const VideoModal = ({ show, onHide, videoUrl, videoTitle }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="video-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{videoTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          <video
            controls
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <BsX className="me-2" /> Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VideoModal; 