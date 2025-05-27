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
      bio: "Pellentesque nec vestibulum orci. Praesent ut dui ornare ipsum cursus mattis porta. Proin finibus imperdiet sodor et molere justo aliquam ut. Suspendisse eu lobortis orci, eget mattis dolor molestm mauris dolor, interdum at rhoncus eu, aliquam consequat purus. Praesent in sapien lectus. Duis quis faucibus odio. Etiam blandit rutrum justo sit amet, volutpat sapien auctor tempus. Nam ex elit, efficitur nec lacus sed, aliquam vitae lacus.",
    },
     {
      id: 4,
      name: "Tiago Carvalho",
      role: "WEB DEVELOPER",
      image: tiagoFoto,
      bio: "Pellentesque nec vestibulum orci. Praesent ut dui ornare ipsum cursus mattis porta. Proin finibus imperdiet sodor et molere justo aliquam ut. Suspendisse eu lobortis orci, eget mattis dolor molestm mauris dolor, interdum at rhoncus eu, aliquam consequat purus. Praesent in sapien lectus. Duis quis faucibus odio. Etiam blandit rutrum justo sit amet, volutpat sapien auctor tempus. Nam ex elit, efficitur nec lacus sed, aliquam vitae lacus.",
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
    <div className="about-us-page">
      <Container className="py-5">
        {/* Page Title */}
        <Row className="mb-5">
          <Col>
            <h1 className="page-title-microsite">About Us</h1>
          </Col>
        </Row>

        {/* Hero Image */}
        <Row className="mb-5">
          <Col>
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop" 
                alt="Team collaboration" 
                className="hero-image"
              />
            </div>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="mb-5">
          <Col lg={8}>
            <Card className="company-info-card">
              <Card.Body>
                <h2 className="section-title">Projeto SoftSkills</h2>
                <p className="company-description">
                SoftSkills é uma plataforma de formação interna, disponível em versão web e mobile. O objetivo é centralizar e facilitar o acesso a conteúdos educativos.
                Inspirada em plataformas como a Udemy, a SoftSkills permite que os colaboradores explorem cursos criados pela própria empresa, acompanhem o seu progresso, realizem avaliações e obtenham certificados. A plataforma promove uma cultura de aprendizagem contínua, contribuindo para o crescimento profissional.
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Sidebar */}
          <Col lg={4}>
            <div className="sidebar-content">
              <Card className={`info-card mb-3 ${isVisible ? 'fade-in' : ''}`}>
                <Card.Body>
                  <h4 className="info-title">Quem somos</h4>
                  <p className="info-text">{companyInfo.whoWeAre}</p>
                </Card.Body>
              </Card>
              
              <Card className={`info-card mb-3 ${isVisible ? 'fade-in' : ''}`} style={{animationDelay: '0.2s'}}>
                <Card.Body>
                  <h4 className="info-title">O que fazemos</h4>
                  <p className="info-text">{companyInfo.whatWeDo}</p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="team-section">
          {teamMembers.map((member, index) => (
            <Col key={member.id} lg={3} md={5} className="mb-4">
              <Card className={`team-member-card ${isVisible ? 'slide-up' : ''}`} 
                    style={{animationDelay: `${index * 0.2}s`}}>
                <Card.Body className="text-center">
                  <div className="member-image-container">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="member-image"
                    />
                    <div className="connector-line"></div>
                  </div>
                  
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                  
                  
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Navigation */}
        <Row className="mt-5">
          <Col className="text-center">
            <button 
              className="btn btn-outline-primary back-button"
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