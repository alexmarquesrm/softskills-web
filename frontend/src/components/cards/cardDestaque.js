import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import './cardDestaque.css';

const EscolaOnlineCard = () => {
  return (
    <Card className="destaque-card my-5">
      <Row className="align-items-center">
        <Col md={8}>
          <Card.Body>
            <h2>A nossa escola agora também é online!</h2>
            <Card.Text className="destaque-text">
              Nada melhor do que preparar todos os pedidos no conforto da tua casa,
              com acesso fácil pelo computador ou telemóvel. Mais flexibilidade, mais conveniência.
            </Card.Text>
          </Card.Body>
        </Col>
        <Col md={4}>
          <Image
            src="https://via.placeholder.com/300x200?text=Online+Learning" // exemplo de imagem
            alt="Ilustração online"
            fluid
            className="destaque-img"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default EscolaOnlineCard;
