import React from "react";
import { Card, Button} from "react-bootstrap";
import { Clock, Users } from "react-feather";
import ReactGif from "./../../images/react.gif";
import "./cardCourses.css";

function cardCourses({ curso }) {
  const formatDate = (date) => {
    const data = new Date(date);
    return data.toISOString().split('T')[0];
  };

  return (
      <Card className="mt-2 mb-3 shadow-lg border-0 d-flex flex-column w-100 h-100" style={{ borderRadius: "10px", maxWidth: "450px" }}>
        <div
          style={{
            height: "200px",
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

        <Card.Body className="d-flex flex-column">
          <Card.Title className="text-primary fw-bold border-bottom pb-2">{curso.titulo}</Card.Title>

          {curso.sincrono?.formador?.colaborador?.nome && (
            <Card.Subtitle className="text-muted mt-1 mb-2">Professor: {curso.sincrono.formador.colaborador.nome}</Card.Subtitle>
          )}

          <div className="mt-1">
            <strong>Descrição:</strong>
            <p className="text-muted mt-1 descricao-limitada">{curso.descricao}</p>
          </div>
          
          {curso.total_horas && (
            <div className="d-flex align-items-center mb-1">
              <Clock size={16} className="me-2 text-secondary" />
              <span>{curso.total_horas} Horas</span>
            </div>
          )}

          {curso.sincrono?.vagas && (
            <div className="d-flex align-items-center mb-2">
              <Users size={16} className="me-2 text-secondary" />
              <span>{curso.sincrono.vagas} Vagas</span>
            </div>
          )}

          <div className="text-muted">
            Tipo: {curso.tipo === "S" ? "Sincrono" : curso.tipo === "A" ? "Assincrono" : "Desconhecido"}
          </div>

          {curso.sincrono?.inicio && (
            <div className="text-muted">
              Início: {formatDate(curso.sincrono.inicio)}
            </div>
          )}

          <Button variant="link" className="p-0 mt-auto text-dark fw-bold align-self-start">
            Ver Mais
          </Button>
        </Card.Body>

      </Card>
  );
}

export default cardCourses;
