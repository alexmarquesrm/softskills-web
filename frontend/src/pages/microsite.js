import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import "../pages/microsite.css";
//Fotos
import alenxandreFoto from '../pages/FotosAboutUs/Screenshot_1.png';
import rodrigoFoto from '../pages/FotosAboutUs/Screenshot_2.png';
import franciscoFoto from '../pages/FotosAboutUs/Screenshot_3.png';
import tiagoFoto from '../pages/FotosAboutUs/Screenshot_4.png';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
 
  const teamMembers = [
    {
      id: 1,
      name: "Alexandre Marques",
      role: "LEAD DEVELOPER",
      image: alenxandreFoto,      
      bio: "Apaixonado por videojogos desde pequeno, foi através deles que descobri o mundo da programação. Fascinado por tecnologia desde sempre, hoje dedico-me ao desenvolvimento de tudo um pouco. Fora do ecrã, adoro andar de mota, praticar ginásio e airsoft.",
    },
    {
      id: 2,
      name: "Rodrigo Marques",
      role: "WEB DEVELOPER",
      image: rodrigoFoto, 
      bio: "Maecenas gravida non erat et bibendum. Sed sem nulla. Cursus rutrum feugiat sed, cursus eget orci. Curabitur feugiat lorem et vaius vehicula. Nunc rhoncus augue eu erat cursus. Lorem ipsum dolor sit amet. Suspendisse in sapien ut magna consequat efficitur. Etiam scelerisque commodo tortor et sodales tellus. Praesent dictum, ipsum et pharetra cursus. Sed ac quis odio. Accumsan magna ut tristique orci. Sed ac lorem mili. Donec lacinia interdum ipsum et finibus mauris placerat non.",
    },
    {
      id: 3,
      name: "Francisco Vitorino",
      role: "MOBILE DEVELOPER",
      image: franciscoFoto,
      bio: "Sou um amante das tecnologias e pouco a pouco, desde pequeno, desenvolvi o gosto pela programação. Sempre tive a curiosidade de como eram feitos os sites, aplicações mobile e etc. e foi graças a isso que decidi levar a programação para a minha vida.",
    },
     {
      id: 4,
      name: "Tiago Carvalho",
      role: "WEB DEVELOPER",
      image: tiagoFoto,
      bio: "Apaixonado por duas rodas, livros e bons jogos. Se não estou na estrada de mota, estou mergulhado numa história, (no chão de uma estrada) ou em alguma partida de algum jogo.",
    }
  ];

  const companyInfo = {
    whoWeAre: "Alunos de Engenharia Informática, amantes de Tecnologias e VideoJogos.",
    whatWeDo: "Para além de adorarmos programar nos tempos livres, na maior parte do tempo ou estamos a jogar ou a pensar quando vamos jogar novamente.",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  const handleBackToHome = () => {
    navigate(-1);
  };

  return (
    <div className="microsite-about-us-page">
      <Container className="py-5">
        {/* Page Title */}
        <Row className="mb-5">
          <Col>
            <h1 className="microsite-page-title">About Us</h1>
          </Col>
        </Row>

        {/* Hero Image */}
        <Row className="mb-5">
          <Col>
            <div className="microsite-hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop" 
                alt="Team collaboration" 
                className="microsite-hero-image"
              />
            </div>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="mb-5">
          <Col lg={8}>
            <Card className="microsite-company-info-card">
              <Card.Body>
                <h2 className="microsite-section-title">Projeto SoftSkills</h2>
                <p className="microsite-company-description">
                SoftSkills é uma plataforma de formação interna, disponível em versão web e mobile. O objetivo é centralizar e facilitar o acesso a conteúdos educativos.
                Inspirada em plataformas como a Udemy, a SoftSkills permite que os colaboradores explorem cursos criados pela própria empresa, acompanhem o seu progresso, realizem avaliações e obtenham certificados. A plataforma promove uma cultura de aprendizagem contínua, contribuindo para o crescimento profissional.
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Sidebar */}
          <Col lg={4}>
            <div className="microsite-sidebar-content">
              <Card className={`microsite-info-card mb-3 ${isVisible ? 'microsite-fade-in' : ''}`}>
                <Card.Body>
                  <h4 className="microsite-info-title">Quem somos</h4>
                  <p className="microsite-info-text">{companyInfo.whoWeAre}</p>
                </Card.Body>
              </Card>
              
              <Card className={`microsite-info-card mb-3 ${isVisible ? 'microsite-fade-in' : ''}`} style={{animationDelay: '0.2s'}}>
                <Card.Body>
                  <h4 className="microsite-info-title">O que fazemos</h4>
                  <p className="microsite-info-text">{companyInfo.whatWeDo}</p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="microsite-team-section">
          {teamMembers.map((member, index) => (
            <Col key={member.id} lg={3} md={5} className="mb-4">
              <Card className={`microsite-team-member-card ${isVisible ? 'microsite-slide-up' : ''}`} 
                    style={{animationDelay: `${index * 0.2}s`}}>
                <Card.Body className="text-center">
                  <div className="microsite-member-image-container">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="microsite-member-image"
                    />
                    <div className="microsite-connector-line"></div>
                  </div>
                  
                  <h3 className="microsite-member-name">{member.name}</h3>
                  <p className="microsite-member-role">{member.role}</p>
                  <p className="microsite-member-bio">{member.bio}</p>
                  
                  
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Navigation */}
        <Row className="mt-5">
          <Col className="text-center">
            <button 
              className="btn btn-outline-primary microsite-back-button"
              onClick={handleBackToHome}
            >
              ← Back to Home
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};


export default AboutUs;