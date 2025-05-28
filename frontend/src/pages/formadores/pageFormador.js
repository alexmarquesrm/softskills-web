import React, { useEffect, useState, useMemo } from "react";
import axios from "../../config/configAxios";
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import { FileEarmarkText, ExclamationTriangle, ArrowRightCircle, StarFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
/* COMPONENTES */
import CardInfo from "../../components/cards/cardDestaque";
import CardPedido from '../../components/cards/cardPedido';
import CardRow from '../../components/cards/cardRow';
import FeaturedCourses from "../../components/cards/cardCourses";
import WelcomeNotification from "../../components/notifications/WelcomeNotification";

export default function PaginaGestor() {
  const [curso, setCurso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saudacao, setSaudacao] = useState('');
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mediaGeral, setMediaGeral] = useState(0);
  const nome = sessionStorage.getItem('nome');
  const navigate = useNavigate();
  const navToPage = (url) => {
    navigate(url)
  }
  const cursosComAvaliacoes = curso.filter(cursoItem =>
    avaliacoes.some(a => a.curso_id === cursoItem.curso_id)
  );

  const fetchSaudacao = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('/colaborador/saudacao', {
        headers: { Authorization: `${token}` }
      });
      setSaudacao(response.data.saudacao);
    } catch (error) {
      console.error('Erro ao obter saudação:', error);
    }
  };

  const fetchCursos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const formadorId = sessionStorage.getItem('colaboradorid');

      const response = await axios.get(`/curso/formador/${formadorId}`, {
        headers: { Authorization: `${token}` }
      });

      setCurso(response.data);

    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      setError("Não foi possível carregar os cursos");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvaliacoes = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const formadorId = sessionStorage.getItem('colaboradorid');

      const response = await axios.get(`/avaliacao-formador?formador_id=${formadorId}`, {
        headers: { Authorization: `${token}` }
      });

      setAvaliacoes(response.data);

      // Calcular média geral
      if (response.data.length > 0) {
        const soma = response.data.reduce((acc, curr) => acc + curr.avaliacao, 0);
        setMediaGeral(soma / response.data.length);
      }

    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    }
  };

  useEffect(() => {
    fetchCursos();
    fetchSaudacao();
    fetchAvaliacoes();
  }, []);

  const filteredCurso = useMemo(() => {
    if (curso.length === 0) return [];

    const hoje = new Date(); // Data e hora atual do sistema
    const quinzeDiasDepois = new Date(hoje);
    quinzeDiasDepois.setDate(hoje.getDate() + 15);

    return curso
      .filter(item => {
        // Verifica se o curso foi aprovado e não está pendente
        if (item.aprovado !== true || item.pendente === true) return false;
        // Verifica se tem data de início
        const dataInicio = item.curso_sincrono?.data_inicio;
        if (!dataInicio) return false;
        const dataInicioObj = new Date(dataInicio);
        // Verifica se a data está entre hoje e 15 dias depois
        return dataInicioObj >= hoje && dataInicioObj <= quinzeDiasDepois;
      })
      .sort(
        (a, b) =>
          new Date(a.curso_sincrono?.data_inicio) - new Date(b.curso_sincrono?.data_inicio)
      );
  }, [curso]);

  const filteredCursoAtivo = useMemo(() => {
    if (curso.length === 0) return [];

    return curso.filter(item => {
      // Verifica se tem data de início
      const dataInicio = item.curso_sincrono?.data_inicio;
      if (!dataInicio) return false;

      // Verifica se já começou e não está terminado
      const jaComecou = new Date(dataInicio) <= new Date();
      const naoTerminado = !item.curso_sincrono?.estado;

      return jaComecou && naoTerminado;
    });
  }, [curso]);

  // Função para calcular a média por curso
  const getMediaPorCurso = (cursoId) => {
    const avaliacoesDoCurso = avaliacoes.filter(a => a.curso_id === cursoId);
    if (avaliacoesDoCurso.length === 0) return 0;

    const soma = avaliacoesDoCurso.reduce((acc, curr) => acc + curr.avaliacao, 0);
    return soma / avaliacoesDoCurso.length;
  };

  const renderPedidoCard = (curso, index) => {
    if (!curso) return null;

    return (
      <CardPedido
        key={curso.curso_id || index}
        pedido={{
          ...curso,
          titulo: curso.titulo,
          formador: curso.formador?.nome || 'Não especificado',
          tipo: 'CURSO',
          tipoLabel: 'Curso',
          data: curso.curso_sincrono?.data_inicio
        }}
        index={index}
        showFormador={false}
        showTimeAgo={false}
      />
    );
  };

  const renderCourseCard = (curso, index) => (
    <FeaturedCourses key={curso.curso_id || index} curso={curso} mostrarBotao={true} mostrarInicioEFim={true} />
  );

  if (error) {
    return (
      <Container className="error-container text-center py-5">
        <div className="error-icon-container">
          <ExclamationTriangle className="error-icon" />
        </div>
        <h3 className="mt-3">Ocorreu um erro</h3>
        <p className="text-muted">{error.message}</p>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </Container>
    );
  }

  return (
    <Container fluid className="gestor-container">
      <WelcomeNotification />
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">{saudacao}, <span className="user-name">{nome}</span></p>
        </div>
      </div>

      <CardInfo />

      <div className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">
            <FileEarmarkText className="section-icon" />
            Cursos a começar
          </h2>
          <div className="section-actions">
            <button className="btn btn-link section-link">
              Ver Todos <ArrowRightCircle size={16} className="ms-1" />
            </button>
          </div>
        </div>

        <div className="section-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>A carregar cursos...</p>
            </div>
          ) : filteredCurso.length > 0 ? (
            <CardRow
              dados={filteredCurso}
              renderCard={renderPedidoCard}
              scrollable={true}
            />
          ) : (
            <div className="empty-state text-center p-4">
              <FileEarmarkText size={40} className="empty-icon mb-3" />
              <p>Não há cursos programados para começar nos próximos 15 dias.</p>
            </div>
          )}
        </div>
      </div>

      <div className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">
            <FileEarmarkText className="section-icon" />
            Cursos ativos
          </h2>
          <div className="section-actions">
            <button className="btn btn-link section-link" onClick={() => { navToPage('/formador/cursos'); window.scrollTo(0, 0); }}>
              Ver Todos <ArrowRightCircle size={16} className="ms-1" />
            </button>
          </div>
        </div>

        <div className="section-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>A carregar cursos...</p>
            </div>
          ) : filteredCursoAtivo.length > 0 ? (
            <div className="courses-grid">
              {filteredCursoAtivo.slice(0, 8).map((item, index) =>
                renderCourseCard(item, index)
              )}
            </div>
          ) : (
            <div className="empty-state text-center">
              <FileEarmarkText size={40} className="empty-icon mb-3" />
              <p>Não há cursos ativos neste momento.</p>
            </div>
          )}
        </div>
      </div>

      {/* Seção de avaliações movida para o final */}
      <div className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">
            <StarFill className="section-icon" />
            Avaliações
          </h2>
        </div>

        <div className="section-content">
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5>Média Geral</h5>
                  <div className="d-flex align-items-center">
                    <div className="display-4 me-3">{mediaGeral.toFixed(1)}</div>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarFill
                          key={star}
                          className={star <= Math.round(mediaGeral) ? "text-warning" : "text-muted"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted mt-2">
                    Baseado em {avaliacoes.length} avaliações
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Distribuição de Avaliações</h5>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = avaliacoes.filter(a => a.avaliacao === rating).length;
                    const percentage = avaliacoes.length > 0 ? (count / avaliacoes.length) * 100 : 0;

                    return (
                      <div key={rating} className="d-flex align-items-center mb-2">
                        <div className="me-2" style={{ width: '60px' }}>
                          {rating} <StarFill className="text-warning" />
                        </div>
                        <div className="progress flex-grow-1" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="ms-2" style={{ width: '40px' }}>
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </Card.Body>
          </Card>
          {cursosComAvaliacoes.length > 0 && (
            <>
              <h5 className="mb-3">Avaliações por Curso</h5>
              <Row>
                {curso.map((cursoItem) => {
                  const media = getMediaPorCurso(cursoItem.curso_id);
                  const avaliacoesDoCurso = avaliacoes.filter(a => a.curso_id === cursoItem.curso_id);

                  if (avaliacoesDoCurso.length === 0) return null;

                  return (
                    <Col md={4} key={cursoItem.curso_id} className="mb-3">
                      <Card>
                        <Card.Body>
                          <h6 className="mb-2">{cursoItem.titulo}</h6>
                          <div className="d-flex align-items-center mb-2">
                            <div className="h4 mb-0 me-2">{media.toFixed(1)}</div>
                            <div className="stars">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarFill
                                  key={star}
                                  className={star <= Math.round(media) ? "text-warning" : "text-muted"}
                                  size={14}
                                />
                              ))}
                            </div>
                          </div>
                          <Badge bg="light" text="dark">
                            {avaliacoesDoCurso.length} avaliações
                          </Badge>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}