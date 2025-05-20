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
  const [curso, setCurso] = useState([]);
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
  useEffect(() => {
    fetchCursos();
    fetchSaudacao();
  }, []);

  const filteredCurso = useMemo(() => {
    if (curso.length === 0) return [];

    const hoje = new Date(); // Data e hora atual do sistema
    const quinzeDiasDepois = new Date(hoje);
    quinzeDiasDepois.setDate(hoje.getDate() + 15);

    return curso.filter(item => {
      // Verifica se tem data de início
      const dataInicio = item.curso_sincrono?.data_inicio;
      if (!dataInicio) return false;

      const dataInicioObj = new Date(dataInicio);
      
      // Verifica se a data está entre hoje e 15 dias depois
      return dataInicioObj >= hoje && dataInicioObj <= quinzeDiasDepois;
    }).sort((a, b) => new Date(a.curso_sincrono?.data_inicio) - new Date(b.curso_sincrono?.data_inicio));
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
              <p className="text-muted">Não há cursos programados para começar nos próximos 15 dias.</p>
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
            <button className="btn btn-link section-link" onClick={() => navToPage('/formador/cursos')}>
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
    </Container>
  );
}