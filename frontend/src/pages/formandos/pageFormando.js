import React, { useEffect, useState, useMemo } from "react";
import axios from "../../config/configAxios";
import { Container } from "react-bootstrap";
import { FileEarmarkText, ExclamationTriangle, ArrowRightCircle, } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
/* COMPONENTES */
import CardInfo from "../../components/cards/cardDestaque";
import CardPedido from '../../components/cards/cardPedido';
import CardRow from '../../components/cards/cardRow';
import FeaturedCourses from "../../components/cards/cardCourses";
import WelcomeNotification from "../../components/notifications/WelcomeNotification";

export default function PaginaGestor() {
  const [inscricao, setInscricao] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saudacao, setSaudacao] = useState('');
  const nome = sessionStorage.getItem('nome');
  const navigate = useNavigate();
  const navToPage = (url) => {
    navigate(url)
  }

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

  const fetchInscricao = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await axios.get('/inscricao/minhas', {
        headers: { Authorization: `${token}` }
      });

      // apenas as inscrições do utilizador autenticado
      setInscricao(response.data);
    } catch (error) {
      console.error("Erro ao carregar inscrições:", error);
      setError("Não foi possível carregar as inscrições");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurso = async () => {
  try {
    const response = await axios.get("/curso/landing");

    let todosCursos = [];

    // Se já vierem separados por tipo
    if (response.data.sincronos && response.data.assincronos) {
      const sincronos = response.data.sincronos.slice(0, 4);
      const assincronos = response.data.assincronos.slice(0, 4);
      todosCursos = [...sincronos, ...assincronos];
    } 
    // Se vier num array plano
    else if (Array.isArray(response.data)) {
      const sincronos = response.data
        .filter(curso => curso.tipo === "S")
        .slice(0, 4);

      const assincronos = response.data
        .filter(curso => curso.tipo === "A")
        .slice(0, 4);

      todosCursos = [...sincronos, ...assincronos];
    }

    setCursos(todosCursos);
  } catch (error) {
    console.error("Erro ao encontrar cursos:", error);
  }
};

  useEffect(() => {
    fetchInscricao();
    fetchCurso();
    fetchSaudacao();
  }, []);

  const filteredInscricao = useMemo(() => {
    if (inscricao.length === 0) return [];

    return inscricao.filter(item => {

      // Verifica se ainda está em período de inicio
      const dataLimite = item.curso_sincrono?.data_inicio;
      if (!dataLimite || new Date(dataLimite) <= new Date()) return false;

      return true;
    });
  }, [inscricao]);

  const filteredInscricaoAtivo = useMemo(() => {
    if (inscricao.length === 0) return [];

    return inscricao.filter(item => {
      // Verifica se já começou
      const dataLimite = item.inscricao_curso?.curso_sincrono?.data_inicio;
      if (!dataLimite || new Date(dataLimite) > new Date()) return false;

      if (item.inscricao_curso?.curso_sincrono?.estado === true) return false;

      return true;
    });
  }, [inscricao]);

  const renderPedidoCard = (curso, index) => (
    <CardPedido index={index} curso={curso} />
  );

  const renderCoursesInscCard = (inscricao, index) => (
    <FeaturedCourses key={inscricao.inscricao_id || index} curso={inscricao.inscricao_curso} inscricao={inscricao} mostrarBotao={true} mostrarInicioEFim={true} />
  );

  const renderCourseCard = (curso, index) => (
    <FeaturedCourses key={curso.id || index} curso={curso} />
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
            Trabalhos
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
          ) : filteredInscricao.length > 0 ? (
            <CardRow dados={[...filteredInscricao].sort((a, b) => new Date(a.curso_sincrono?.data_inicio) - new Date(b.curso_sincrono?.data_inicio))} renderCard={renderPedidoCard} scrollable={true} />
          ) : (
            <div className="empty-state text-center">
              <FileEarmarkText size={40} className="empty-icon mb-3" />
              <p>Não há trabalhos para entregar neste momento.</p>
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
            <button className="btn btn-link section-link" onClick={() => navToPage('/utilizadores/percursoFormativo')}>
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
          ) : filteredInscricaoAtivo.length > 0 ? (
            <div className="courses-grid">
              {filteredInscricaoAtivo.slice(0, 8).map((item, index) =>
                renderCoursesInscCard(item, index)
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

      <div className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">
            <FileEarmarkText className="section-icon" />
            Cursos em Destaque
          </h2>
          <div className="section-actions">
            <button className="btn btn-link section-link" onClick={() => navToPage('/utilizadores/lista/cursos')}>
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
          ) : cursos.length > 0 ? (
            <>
              <div className="courses-grid">
                {cursos.slice(0, 8).map((item, index) =>
                  renderCourseCard(item, index)
                )}
              </div>
            </>
          ) : (
            <div className="empty-state text-center">
              <FileEarmarkText size={40} className="empty-icon mb-3" />
              <p>Não há cursos em destaque neste momento.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}