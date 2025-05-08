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

export default function PaginaGestor() {
  const [curso, setCurso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nome = sessionStorage.getItem('nome');
  const id = sessionStorage.getItem('colaboradorid');
  const navigate = useNavigate();
  const navToPage=(url)=>{
      navigate(url)
  }
  
  const fetchCursos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`/curso`, {
        headers: { Authorization: `${token}` }
      });

      const cursos = response.data;
      setCurso(cursos);
    } catch (error) {
      console.error("Erro ao buscar inscrições", error);
      setError("Não foi possível carregar as inscrições");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const filteredCurso = useMemo(() => {
    if (curso.length === 0) return [];

    return curso.filter(item => {
      if (item.tipo !== 'S') return false;

      // Verifica se ainda está em período de inicio
      const dataLimite = item.sincrono?.inicio;
      if (!dataLimite || new Date(dataLimite) <= new Date()) return false;

      // Verifica se o formador é o mesmo que o utilizador logado
      const formadorCurso = item.sincrono?.formador?.formador_id;
      if (formadorCurso && Number(formadorCurso) !== Number(id)) return false;

      return true;
    });
  }, [curso, id]);

  const filteredCursoAtivo = useMemo(() => {
    if (curso.length === 0) return [];

    return curso.filter(item => {
      if (item.tipo !== 'S') return false;

      // Verifica se já começou
      const dataLimite = item.sincrono?.inicio;
      if (!dataLimite || new Date(dataLimite) > new Date()) return false;

      if (item.sincrono?.estado === true) return false;
      
      // Verifica se o formador é o mesmo que o utilizador logado
      const formadorCurso = item.sincrono?.formador?.formador_id;
      if (formadorCurso && Number(formadorCurso) !== Number(id)) return false;

      return true;
    });
  }, [curso, id]);

  const renderPedidoCard = (curso, index) => (
    <CardPedido index={index} curso={curso} />
  );

  const renderCourseCard = (curso, index) => (
    <FeaturedCourses key={curso.curso_id || index} curso={curso} mostrarBotao={true} mostrarInicioEFim={true}/>
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
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">Bem-vindo, <span className="user-name">{nome}</span></p>
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
            <CardRow dados={[...filteredCurso].sort((a, b) => new Date(a.sincrono?.inicio) - new Date(b.sincrono?.inicio))} renderCard={renderPedidoCard} scrollable={true} />
          ) : (
            <div className="empty-state text-center">
              <FileEarmarkText size={40} className="empty-icon mb-3" />
              <p>Não há cursos programados para começar neste momento.</p>
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
            <button className="btn btn-link section-link" onClick={()=>navToPage('/formador/cursos')}>
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