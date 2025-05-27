import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Laptop, Phone, BookHalf } from 'react-bootstrap-icons';
import './cardDestaque.css';

const CardDestaque = () => {
  return (
    <Card className="destaque-card">
      <Card.Body>
        <Row className="align-items-center">
          <Col lg={7} md={7}>
            <div className="destaque-content">
              <span className="destaque-badge">Novidade</span>
              <h2 className="destaque-title">
                Agora a nossa escola também está online!
              </h2>
              <p className="destaque-text">
                Nada melhor do que preparar todos os pedidos no conforto da tua casa,
                de fácil acesso no teu computador ou telemóvel. Aproveite todas as
                funcionalidades e mantenha-se atualizado.
              </p>
              <div className="destaque-features">
                <div className="feature">
                  <div className="feature-icon">
                    <Laptop />
                  </div>
                  <span>Acesso pelo computador</span>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <Phone />
                  </div>
                  <span>Acesso por dispositivos móveis</span>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <BookHalf />
                  </div>
                  <span>Recursos completos</span>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={5} md={5} className="d-none d-md-block">
            <div className="destaque-image-container">
              <div className="destaque-image-placeholder">
                <div className="destaque-illustration">
                  <div className="illustration-laptop">
                    <div className="laptop-screen">
                      <div className="laptop-screen-content">
                        <div className="screen-line"></div>
                        <div className="screen-line"></div>
                        <div className="screen-line short"></div>
                      </div>
                    </div>
                    <div className="laptop-base"></div>
                  </div>
                  <div className="illustration-phone">
                    <div className="phone-screen">
                      <div className="phone-screen-content">
                        <div className="screen-dot"></div>
                        <div className="screen-line small"></div>
                        <div className="screen-line small"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CardDestaque;