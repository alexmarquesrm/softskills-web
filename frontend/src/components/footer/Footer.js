import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin} from "react-icons/fa";
import "./footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <Container>
        <Row className="main-footer py-4">
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <h5 className="footer-heading mb-4">Sobre Nós</h5>
            <p className="footer-about">
              Fornecemos os melhores cursos para os nossos formandos.
              A nossa missão é criar valor e excelência através da tecnologia.
            </p>
            <div className="social-icons mt-3">
              <a href="/" className="social-icon me-3"><FaFacebook /></a>
              <a href="/" className="social-icon me-3"><FaTwitter /></a>
              <a href="/" className="social-icon me-3"><FaInstagram /></a>
              <a href="/" className="social-icon"><FaLinkedin /></a>
            </div>
          </Col>
          
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <h5 className="footer-heading mb-4">Links Úteis</h5>
            <ul className="footer-links">
              <li><a href="/about">Sobre</a></li>
              <li><a href="/services">Serviços</a></li>
              <li><a href="/projects">Projetos</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/careers">Carreiras</a></li>
            </ul>
          </Col>
          
          <Col lg={4} md={12}>
            <h5 className="footer-heading mb-4">Contactos</h5>
            <ul className="contact-info">
              <li>
                <FaPhone className="contact-icon" />
                <span>+351 123 456 789</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>info@empresa.pt</span>
              </li>
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>Rua Principal 123, Lisboa, Portugal</span>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="footer-bottom py-3">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0">© {currentYear} Empresa. Todos os direitos reservados.</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0">
              <a href="/privacy" className="footer-bottom-link me-3">Política de Privacidade</a>
              <a href="/terms" className="footer-bottom-link">Termos & Condições</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;