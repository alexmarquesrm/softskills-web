import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Clock, Users, Calendar, Award } from "react-feather";
import ReactGif from "./../../images/react.gif";
import "./cardCourses.css";

function CardCourses({ curso, inscricao }) {
  const formatDate = (date) => {
    const data = new Date(date);
    return data.toISOString().split('T')[0];
  };

  const getBadgeVariant = (tipo) => {
    switch (tipo) {
      case "S": return "primary";
      case "A": return "success";
      default: return "secondary";
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case "S": return "Síncrono";
      case "A": return "Assíncrono";
      default: return "Desconhecido";
    }
  };

  return (
    <Card className="course-card h-100">
      <div className="course-header">
        <img src={ReactGif} alt="Curso" className="course-image" />
        <Badge
          className="course-type-badge"
          bg={getBadgeVariant(curso.tipo)}
        >
          {getTipoLabel(curso.tipo)}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="course-title">{curso.titulo}</Card.Title>

        {curso.sincrono?.formador?.colaborador?.nome && (
          <div className="course-instructor">
            <Award size={16} className="icon" />
            <span>{curso.sincrono.formador.colaborador.nome}</span>
          </div>
        )}

        <div className="course-description">
          <p>{curso.descricao}</p>
        </div>

        <div className="course-meta">
          {curso.total_horas && (
            <div className="meta-item">
              <Clock size={16} className="icon" />
              <span>{curso.total_horas} horas</span>
            </div>
          )}

          {curso.sincrono?.vagas && (
            <div className="meta-item">
              <Users size={16} className="icon" />
              <span>{curso.sincrono.vagas} vagas</span>
            </div>
          )}

          {curso.sincrono?.inicio && (
            <div className="meta-item">
              <Calendar size={16} className="icon" />
              <span>{formatDate(curso.sincrono.inicio)}</span>
            </div>
          )}

          {inscricao?.estado !== undefined && (
            <div className="meta-item">
              <span>Estado: {inscricao.estado ? 'Concluído' : 'Em curso'}</span>
            </div>
          )}

          {inscricao?.data_certificado && (
            <div className="meta-item">
              <span>Certificado: {formatDate(inscricao.data_certificado)}</span>
            </div>
          )}
        </div>

        <Button variant="primary" className="course-button mt-auto">
          Ver Detalhes
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CardCourses;