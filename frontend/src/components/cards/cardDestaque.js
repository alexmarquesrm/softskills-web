// cardDestaque.js
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap'; // removido Container
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';

const EscolaOnlineCard = () => {
  return (
    <Card className="p-4 my-3" style={{ backgroundColor: '#f4f6f8', borderRadius: '0px' }}>
      <Row className="align-items-center">
        <Col md={8}>
          <Card.Body>
            <Card.Title style={{ fontSize: '1.5rem' }}>
              Agora a nossa escola também está online!
            </Card.Title>
            <Card.Text style={{ color: '#555' }}>
              Nada melhor do que preparar todos os pedidos no conforto da tua casa,
              de fácil acesso no teu computador ou telemóvel
            </Card.Text>
          </Card.Body>
        </Col>
        <Col md={4}>
          <Image
            src=""
            alt="Ilustração online"
            fluid
          />
        </Col>
      </Row>
    </Card>
  );
};

export default EscolaOnlineCard;
