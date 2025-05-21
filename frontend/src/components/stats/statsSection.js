import React, { useState, useEffect } from "react";
import axios from "../../config/configAxios";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { PeopleFill, BookFill, PersonBadgeFill } from "react-bootstrap-icons";
import "./statsSection.css";

function StatsSection() {
  const [stats, setStats] = useState({
    activeStudents: 0,
    totalCourses: 0,
    instructors: 0
  });

  const [displayStats, setDisplayStats] = useState({
    activeStudents: 0,
    totalCourses: 0,
    instructors: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchContagemFormandos = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`/formando/totalformandos`, {
          headers: { Authorization: `${token}` }
        });
  
        const countformandos = response.data.total;
  
        setStats(prevStats => ({
          ...prevStats,
          activeStudents: countformandos
        }));
      } catch (error) {
        console.error("Erro ao carregar estatísticas de formandos:", error);
      }
    };

    const fetchContagemCursos = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`/curso/totalcursos`, {
          headers: { Authorization: `${token}` }
        });
  
        const countcursos = response.data.total;
  
        setStats(prevStats => ({
          ...prevStats,
          totalCourses: countcursos
        }));
      } catch (error) {
        console.error("Erro ao carregar estatísticas de cursos:", error);
      }
    };
  
    const fetchContagemFormadores = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`/formador/totalformadores`, {
          headers: { Authorization: `${token}` }
        });
  
        const countformadores = response.data.total;

        setStats(prevStats => ({
          ...prevStats,
          instructors: countformadores
        }));
      } catch (error) {
        console.error("Erro ao carregar estatísticas de formadores:", error);
      }
    };
    fetchContagemFormandos();
    fetchContagemCursos();
    fetchContagemFormadores();
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
  
    const section = document.querySelector(".stats-section");
    if (section) observer.observe(section);
  
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);
  

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setDisplayStats(prev => ({
        activeStudents: prev.activeStudents < stats.activeStudents
          ? Math.min(prev.activeStudents + 250, stats.activeStudents)
          : prev.activeStudents,
        totalCourses: prev.totalCourses < stats.totalCourses
          ? Math.min(prev.totalCourses + 10, stats.totalCourses)
          : prev.totalCourses,
        instructors: prev.instructors < stats.instructors
          ? Math.min(prev.instructors + 2, stats.instructors)
          : prev.instructors
      }));
    }, 50);

    if (
      displayStats.activeStudents === stats.activeStudents &&
      displayStats.totalCourses === stats.totalCourses &&
      displayStats.instructors === stats.instructors
    ) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [stats, displayStats, isVisible]);

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  return (
    <section className="stats-section">
      <div className="stats-bg-shape"></div>
      <Container fluid> {/* Alterado para Container fluid para largura total */}
        <div className="section-header-stats">
          <h2 className="stats-section-title">O nosso impacto</h2>
          <p className="stats-section-subtitle">A transformar a educação pouco a pouco</p>
        </div>

        <Row className="g-4 justify-content-center"> {/* Adicionado justify-content-center */}
          <Col lg={3} md={6} sm={12}> {/* Ajustado tamanho das colunas */}
            <Card className={`stats-card h-100 text-center ${isVisible ? 'animate-in' : ''}`}>
              <div className="icon-wrapper">
                <PeopleFill className="stats-icon" />
              </div>
              <Card.Body>
                <Card.Title className="stats-number">
                  {displayStats.activeStudents.toLocaleString()}+
                </Card.Title>
                <Card.Text className="stats-label">Formandos Ativos</Card.Text>
                <ProgressBar
                  now={calculateProgress(displayStats.activeStudents, stats.activeStudents)}
                  variant="primary"
                  className="stats-progress"
                />
                <p className="stats-caption">Ativos nas diversas áreas</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={12}> {/* Ajustado tamanho das colunas */}
            <Card className={`stats-card h-100 text-center ${isVisible ? 'animate-in delay-1' : ''}`}>
              <div className="icon-wrapper">
                <BookFill className="stats-icon" />
              </div>
              <Card.Body>
                <Card.Title className="stats-number">
                  {displayStats.totalCourses.toLocaleString()}
                </Card.Title>
                <Card.Text className="stats-label">Total de Cursos</Card.Text>
                <ProgressBar
                  now={calculateProgress(displayStats.totalCourses, stats.totalCourses)}
                  variant="success"
                  className="stats-progress"
                />
                <p className="stats-caption">Diversas oportunidades de aprender</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} sm={12}> {/* Ajustado tamanho das colunas */}
            <Card className={`stats-card h-100 text-center ${isVisible ? 'animate-in delay-2' : ''}`}>
              <div className="icon-wrapper">
                <PersonBadgeFill className="stats-icon" />
              </div>
              <Card.Body>
                <Card.Title className="stats-number">
                  {displayStats.instructors.toLocaleString()}
                </Card.Title>
                <Card.Text className="stats-label">Total de Formadores</Card.Text>
                <ProgressBar
                  now={calculateProgress(displayStats.instructors, stats.instructors)}
                  variant="info"
                  className="stats-progress"
                />
                <p className="stats-caption">Os melhores formadores</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="stats-footnote">
          <p>Junta-te à nossa comunidade de formandos ainda hoje!</p>
          <button className="btn btn-primary btn-lg stats-cta">Começar!</button>
        </div>
      </Container>
    </section>
  );
}

export default StatsSection;