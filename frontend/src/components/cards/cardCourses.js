import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Clock, Users } from "react-feather";
import ReactGif from "./../../images/react.gif";

function cardCourses({ cursos = [] }) {
  const formatDate = (date) => {
    const data = new Date(date);
    return data.toISOString().split('T')[0];
  };

  return (
    <Container className="mt-5">
      <h2>Cursos Em Destaque</h2>
      <Row>
        {cursos.map((curso, index) => (
          <Col key={index} md={4}>
            <Card className="mb-4 shadow-lg border-0" style={{ borderRadius: "10px" }}>
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

              <Card.Body>
                {curso.sincrono?.formador?.colaborador?.nome && (
                  <Card.Subtitle className="text-muted">Professor: {curso.sincrono.formador.colaborador.nome}</Card.Subtitle>
                )}

                <Card.Title className="text-primary fw-bold mt-2">{curso.descricao}</Card.Title>

                {curso.total_horas && (
                  <div className="d-flex align-items-center mt-2">
                    <Clock size={16} className="me-2 text-secondary" />
                    <span>{curso.total_horas} Horas</span>
                  </div>
                )}

                {curso.sincrono?.vagas && (
                  <div className="d-flex align-items-center mt-1">
                    <Users size={16} className="me-2 text-secondary" />
                    <span>{curso.sincrono.vagas} Vagas</span>
                  </div>
                )}

                {curso.sincrono?.inicio && (
                  <div className="mt-3 text-muted">
                    Início: {formatDate(curso.sincrono.inicio)}
                  </div>
                )}

                <div className="mt-1 text-muted">
                  Tipo: {curso.tipo === "S" ? "Sincrono" : curso.tipo === "A" ? "Assincrono" : "Desconhecido"}
                </div>

                <Button variant="link" className="p-0 mt-2 text-dark fw-bold">
                  Ver Mais
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default cardCourses;
