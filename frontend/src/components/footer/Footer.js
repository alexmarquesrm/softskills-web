import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-white p-4">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Contactos</h5>
            <p>📞 +351 123 456 789</p>
            <p>📍 Portugal</p>
          </Col>
          <Col md={6}>
            <h5>Legal</h5>
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
