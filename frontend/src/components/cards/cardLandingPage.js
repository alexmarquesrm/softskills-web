import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './cardLandingPage.css';

const LandingCard = () => {
    return (
        <div className="hero-card">
            <Container>
                <Row className="align-items-center min-vh-75">
                    <Col lg={6} md={12} className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                Transforme seu <span className="highlight">Futuro</span> com Educação de Qualidade
                            </h1>
                            <p className="hero-description">
                                Descubra a nossa plataforma de formação, com cursos síncronos e assíncronos lecionados por especialistas. Aprenda ao seu ritmo e atinja os seus objetivos profissionais.
                            </p>
                        </div>
                    </Col>
                    <Col lg={6} md={12} className="hero-visual">
                        <div className="hero-image-container">
                            <div className="floating-card card-1">
                                <div className="card-icon">📚</div>
                                <div className="card-text">
                                    <strong>Cursos Síncronos</strong>
                                    <span>Aulas ao vivo com interação</span>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <div className="card-icon">🎯</div>
                                <div className="card-text">
                                    <strong>Cursos Assíncronos</strong>
                                    <span>Aprenda ao seu ritmo</span>
                                </div>
                            </div>
                            <div className="floating-card card-3">
                                <div className="card-icon">🏆</div>
                                <div className="card-text">
                                    <strong>Certificação</strong>
                                    <span>Reconhecida no mercado</span>
                                </div>
                            </div>
                            <div className="hero-main-visual">
                                <div className="learning-illustration">
                                    <div className="student-avatar"></div>
                                    <div className="progress-rings">
                                        <div className="ring ring-1"></div>
                                        <div className="ring ring-2"></div>
                                        <div className="ring ring-3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LandingCard;