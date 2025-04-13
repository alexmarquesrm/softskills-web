import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Clock, Users, Calendar, Award } from "react-feather";
import ReactGif from "./../../images/react.gif";
import "./cardCourses.css";

function CardCourses({ curso }) {
  const formatDate = (date) => {
    const data = new Date(date);
    return data.toISOString().split('T')[0];
  };

  const getBadgeVariant = (tipo) => {
    switch(tipo) {
      case "S": return "primary";
      case "A": return "success";
      default: return "secondary";
    }
  };

  const getTipoLabel = (tipo) => {
    switch(tipo) {
      case "S": return "Síncrono";
      case "A": return "Assíncrono";
      default: return "Desconhecido";
    }
  };

  return (
    <Card className="course-card">
      <div className="course-header">
        <img src={ReactGif} alt="React" className="course-image" />
        <Badge 
          className="course-type-badge" 
          bg={getBadgeVariant(curso.tipo)}
        >
          {getTipoLabel(curso.tipo)}
        </Badge>
      </div>

      <Card.Body>
        <h3 className="course-title">{curso.titulo}</h3>

        {curso.sincrono?.formador?.colaborador?.nome && (
          <div className="course-instructor">
            <Award size={16} className="icon" />
            {curso.sincrono.formador.colaborador.nome}
          </div>
        )}

        <div className="course-description">
          <p>{curso.descricao}</p>
        </div>

        <div className="course-meta">
          {curso.total_horas && (
            <div className="meta-item">
              <Clock size={16} className="icon" />
              {curso.total_horas} horas
            </div>
          )}

          {curso.sincrono?.vagas && (
            <div className="meta-item">
              <Users size={16} className="icon" />
              {curso.sincrono.vagas} vagas
            </div>
          )}

          {curso.sincrono?.inicio && (
            <div className="meta-item">
              <Calendar size={16} className="icon" />
              {formatDate(curso.sincrono.inicio)}
            </div>
          )}
        </div>

        <Button className="course-button" variant="primary" block>
          Ver Detalhes
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CardCourses;