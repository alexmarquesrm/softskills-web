import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Clock, Users, Calendar, Award, CheckCircle, RefreshCcw, Edit } from "react-feather";
import { useNavigate } from "react-router-dom";
import ReactGif from "./../../images/react.gif";
import "./cardCourses.css";

function CardCourses({ curso, inscricao, mostrarBotao = true, mostrarInicioEFim = false, mostrarBotaoEdit = false }) {
  const navigate = useNavigate();
  const tipoUser = sessionStorage.getItem('tipo');

  const handleEditCourse = (courseId) => {
    navigate(`/gestor/cursos/edit/${courseId}`);
  };

  const handleViewDetails = () => {
    if (tipoUser === "Gestor") {
      navigate(`/gestor/cursodetalhes/${curso.curso_id}`, {
        state: { id: curso.curso_id }
      });
    } else if (tipoUser === "Formando") {
      const cursoId = curso.curso_id || curso.id;
      navigate(`/utilizadores/curso/${cursoId}`);
    } else if (tipoUser === "Formador") {
      navigate(`/formador/curso/${curso.curso_id}`);
    } else {
      navigate(`/curso/${curso.curso_id}`, {
        state: { id: curso.curso_id }
      });
    }
  };

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
      {(mostrarBotaoEdit && tipoUser === "Gestor") && (
      <div className="course-edit-options">
        <button className="edit-course-btn" onClick={() => handleEditCourse(curso.curso_id)}>
          <Edit size={18} />
        </button>
      </div>
      )}

      <div className="course-header" style={{ cursor: 'pointer' }} onClick={handleViewDetails}>
        <img src={ReactGif} alt="Curso" className="course-image" />
        <Badge
          className="course-type-badge"
          bg={getBadgeVariant(curso.tipo)}
        >
          {getTipoLabel(curso.tipo)}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title
          className="course-title"
          style={{ cursor: 'pointer' }}
          onClick={handleViewDetails}
        >
          {curso.titulo}
        </Card.Title>

        {curso.curso_sincrono?.formador?.colaborador?.nome && (
          <div className="course-instructor">
            <Award size={16} className="icon" />
            <span>{curso.curso_sincrono.formador.colaborador.nome}</span>
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

          {curso.curso_sincrono?.vagas && (
            <div className="meta-item">
              <Users size={16} className="icon" />
              <span>{curso.curso_sincrono.vagas} vagas</span>
            </div>
          )}

          {(curso.curso_sincrono?.data_inicio && (mostrarInicioEFim || curso.curso_sincrono?.estado !== true)) && (
            <div className="meta-item">
              <Calendar size={16} className="icon" />
              <span>Início: {formatDate(curso.curso_sincrono.data_inicio)}</span>
            </div>
          )}

          {(curso.curso_sincrono?.data_fim && (mostrarInicioEFim || curso.curso_sincrono?.estado === true)) && (
            <div className="meta-item">
              <Calendar size={16} className="icon" />
              <span>Fim: {formatDate(curso.curso_sincrono.data_fim)}</span>
            </div>
          )}

          {curso.curso_sincrono?.data_limite_inscricao && !curso.curso_sincrono.estado && new Date(curso.curso_sincrono.data_limite_inscricao) > new Date() && (
            <div className="meta-item">
              <Calendar size={16} className="icon" />
              <span>Inscrição até: {formatDate(curso.curso_sincrono.data_limite_inscricao)}</span>
            </div>
          )}

          {(inscricao?.estado !== undefined || curso?.curso_sincrono?.estado !== undefined) && (
            <div className="meta-item">
              <RefreshCcw size={16} className="icon" />
              <span>Estado: {(() => {
                const estado = inscricao?.estado ?? curso?.curso_sincrono?.estado;
                const dataInicio = curso?.curso_sincrono?.data_limite_inscricao;

                if (estado) return 'Concluído';
                if (dataInicio && new Date(dataInicio) > new Date()) return 'Por começar';
                return 'Em curso';
              })()}</span>
            </div>
          )}

          {inscricao && inscricao?.estado && inscricao.nota !== 0 && (
            <div className="meta-item">
              <CheckCircle size={16} className="icon" />
              <span>Nota: {inscricao.nota}</span>
            </div>
          )}

          {inscricao?.data_certificado && inscricao?.estado && (
            <div className="meta-item">
              <Award size={16} className="icon" />
              <span>Certificado: {formatDate(inscricao.data_certificado)}</span>
            </div>
          )}
        </div>

        {mostrarBotao && (
          <Button
            variant="primary"
            className="course-button mt-auto"
            onClick={handleViewDetails}
          >
            Ver Detalhes
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default CardCourses;