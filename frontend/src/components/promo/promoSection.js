import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Folder, Grid, Tag } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import "./promoSection.css";

function PromoSection() {
  const navigate = useNavigate();
  const navToPage = (url) => {navigate(url)}
  return (
    <Container className="promo-section-container my-5">
      <Card className="promo-card shadow">
        <Card.Body className="text-center p-4">
          <h2 className="promo-title mb-4">Todos Os Cursos Organizados Por:</h2>
          
          <Row className="organization-options mb-4">
            <Col md={4} className="mb-3 mb-md-0">
              <div className="organization-item">
                <div className="icon-container">
                  <Folder className="organization-icon" />
                </div>
                <h4 className="organization-name">Categorias</h4>
              </div>
            </Col>
            
            <Col md={4} className="mb-3 mb-md-0">
              <div className="organization-item">
                <div className="icon-container">
                  <Grid className="organization-icon" />
                </div>
                <h4 className="organization-name">Áreas</h4>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="organization-item">
                <div className="icon-container">
                  <Tag className="organization-icon" />
                </div>
                <h4 className="organization-name">Tópicos</h4>
              </div>
            </Col>
          </Row>
          
          <p className="promo-subtitle mb-4">Explore, Aprenda, Torne-se o melhor.</p>
          
          <button className="btn explore-btn" onClick={() => { navToPage('/cursos-view'); window.scrollTo(0, 0); }}>
            Explorar
          </button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PromoSection;