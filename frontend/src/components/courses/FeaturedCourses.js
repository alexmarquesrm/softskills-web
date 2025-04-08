import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Clock, Users } from "react-feather";
import ReactGif from "./../../images/react.gif"; // Importando o gif do React


const courses = [
  {
    title: "Finanças E Contabilidade",
    professor: "Martins Costa",
    duration: "93 Horas",
    slots: "50 Vagas",
    startDate: "31/12/2025",
  },
  {
    title: "Desenvolvimento",
    professor: "João Pereira",
    duration: "75 Horas",
    slots: "40 Vagas",
    startDate: "15/01/2026",
  },
  {
    title: "Redes de Suporte",
    professor: "Ana Carvalho",
    duration: "60 Horas",
    slots: "35 Vagas",
    startDate: "10/02/2026",
  },
  
];

function FeaturedCourses() {
  return (
    <Container className="mt-5">
      <h2 className="text-white mb-4">Cursos Em Destaque</h2>
      <Row>
        {courses.map((course, index) => (
          <Col key={index} md={4}>
            <Card className="mb-4 shadow-lg border-0" style={{ borderRadius: "10px" }}>
              {/* Parte Superior com Gradiente */}
              <div
                style={{
                  height: "150px",
                  background: "linear-gradient(to bottom, #9E7FCE, #5A4EAE)",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={ReactGif} alt="Ícone" style={{ width: "150px", opacity: 0.8 }} />
              </div>

              {/* Conteúdo do Card */}
              <Card.Body>
                <Card.Subtitle className="text-muted">Professor: {course.professor}</Card.Subtitle>
                <Card.Title className="text-primary fw-bold mt-2">{course.title}</Card.Title>

                <div className="d-flex align-items-center mt-2">
                  <Clock size={16} className="me-2 text-secondary" />
                  <span>{course.duration}</span>
                </div>
                <div className="d-flex align-items-center mt-1">
                  <Users size={16} className="me-2 text-secondary" />
                  <span>{course.slots}</span>
                </div>

                <div className="mt-3 text-muted">Início: {course.startDate}</div>
                <Button variant="link" className="p-0 mt-2 text-dark fw-bold">
                  View More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FeaturedCourses;
