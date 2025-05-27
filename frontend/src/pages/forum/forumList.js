import React, { useState, useEffect, useMemo } from 'react';
import axios from "../../config/configAxios";
import { Link } from 'react-router-dom';
import { MessageSquare, Users, ArrowRight, AlertCircle } from 'react-feather';
import { Container, Row, Col } from 'react-bootstrap';
/* COMPONENTES */
import Filtros from '../../components/filters/filtros';
import SearchBar from '../../components/textFields/search';
/* UTILS */
import { filtrarCursosOuInscricoes } from '../../utils/filtrarCursos';
/* CSS */
import './forumList.css';

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState({ S: false, A: false });
  const [certSelecionado, setCertSelecionado] = useState({ C: false, S: false });
  const [estadoSelecionado, setEstadoSelecionado] = useState({ emCurso: false, terminado: false });
  const [dataSelecionada, setDataSelecionada] = useState({ inicio: '', fim: '' });
  const [nivelSelecionado, setNivelSelecionado] = useState({ 1: false, 2: false, 3: false, 4: false });
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [areaSelecionada, setAreaSelecionada] = useState(null);
  const [topicoSelecionado, setTopicoSelecionado] = useState([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await axios.get('/forum');
        setForums(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar fóruns');
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  const filteredForum = useMemo(() => {
    return filtrarCursosOuInscricoes({
      dados: forums,
      tipoSelecionado,
      certSelecionado,
      estadoSelecionado,
      dataSelecionada,
      nivelSelecionado,
      searchTerm,
      categoriaSelecionada,
      areaSelecionada,
      topicoSelecionado,
      modo: 'forum'
    });
  }, [forums, tipoSelecionado, estadoSelecionado, dataSelecionada, nivelSelecionado, categoriaSelecionada, areaSelecionada, topicoSelecionado, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    // Mantido para compatibilidade com o componente SearchBar
  };

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  // Função para limpar filtros modificada
  const clearFilters = () => {
    setTipoSelecionado({ S: false, A: false });
    setEstadoSelecionado({ emCurso: false, terminado: false });
    setDataSelecionada({ inicio: '', fim: '' });
    setNivelSelecionado({ 1: false, 2: false, 3: false, 4: false });
    setCategoriaSelecionada(null);
    setAreaSelecionada(null);
    setTopicoSelecionado([]);
    setSearchTerm('');
  };

  if (loading) return <div className="loading">Carregando fóruns...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="forum-list-container">
      <Container fluid className="page-container">
        <div className="forum-header">
          <div className="forum-header-content">
            <div className="forum-header-icon">
              <MessageSquare size={32} />
            </div>
            <div className="forum-header-info">
              <h1>Fóruns de Discussão</h1>
              <p className="forum-subtitle">Participe das discussões e compartilhe conhecimento com outros formandos</p>
            </div>
          </div>
        </div>

        <Row className="forum-content">
          {/* Botão para mostrar/ocultar filtros (apenas visível em mobile) */}
          <div className="filters-toggle-wrapper d-lg-none">
            <button className="filters-toggle-btn" onClick={toggleFilters}>
              {isFiltersVisible ? "Ocultar Filtros" : "Mostrar Filtros"}
            </button>
          </div>

          {/* Sidebar com filtros */}
          <Col lg={3} md={12} className={`filtros-sidebar ${isFiltersVisible ? "visible" : "hidden"}`}>
            <Filtros
              tipoSelecionado={tipoSelecionado}
              setTipoSelecionado={setTipoSelecionado}
              certSelecionado={certSelecionado}
              setCertSelecionado={setCertSelecionado}
              estadoSelecionado={estadoSelecionado}
              setEstadoSelecionado={setEstadoSelecionado}
              dataSelecionada={dataSelecionada}
              setDataSelecionada={setDataSelecionada}
              nivelSelecionado={nivelSelecionado}
              setNivelSelecionado={setNivelSelecionado}
              categoriaSelecionada={categoriaSelecionada}
              setCategoriaSelecionada={setCategoriaSelecionada}
              areaSelecionada={areaSelecionada}
              setAreaSelecionada={setAreaSelecionada}
              topicoSelecionado={topicoSelecionado}
              setTopicoSelecionado={setTopicoSelecionado}
              mostrarTipo={false}
              mostrarEstado={false}
              mostrarData={false}
              mostrarNivel={false}
              mostrarCategoria={true}
            />
          </Col>

          {/* Conteúdo principal */}
          <Col lg={9} md={12}>
            <div className="forum-header-actions">
              <div className="forum-count">
                {filteredForum.length === 1 ? (
                  <span>1 fórum encontrado</span>
                ) : (
                  <span>{filteredForum.length} fóruns encontrados</span>
                )}
              </div>

              <div className="search-container">
                <SearchBar
                  searchTerm={searchTerm}
                  handleSearchChange={handleSearchChange}
                  handleSearchClick={handleSearchClick}
                  placeholder="Pesquisar fóruns..."
                />
              </div>
            </div>

            <div className="forum-container">
              {filteredForum.length > 0 ? (
                <div className="forum-grid">
                  {filteredForum.map((forum) => (
                    <div key={forum.forum_id} className="forum-card">
                      <div className="forum-card-header">
                        <div className="forum-category">
                          <span className="category-label">Área:</span>
                          <span className="category-value">{forum.forum_topico?.topico_area?.descricao || 'Não especificada'}</span>
                        </div>
                        <div className="forum-topic">
                          <span className="topic-label">Tópico:</span>
                          <span className="topic-value">{forum.forum_topico?.descricao || 'Não especificado'}</span>
                        </div>
                      </div>

                      <div className="forum-card-body">
                        <h2 className="forum-title">{forum.descricao}</h2>
                        <div className="forum-stats">
                          <div className="stat-item">
                            <MessageSquare size={16} />
                            <span>{forum.thread_count || 0} Threads</span>
                          </div>
                          <div className="stat-item">
                            <Users size={16} />
                            <span>{forum.participant_count || 0} Participantes</span>
                          </div>
                        </div>
                      </div>

                      <div className="forum-card-footer">
                        <Link to={`/forum/${forum.forum_id}`} className="view-forum-btn">
                          Aceder ao Fórum
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-courses">
                  <AlertCircle size={36} className="mb-3" />
                  <p>Não foram encontrados fóruns com os filtros selecionados.</p>
                  <button className="reset-search-btn" onClick={clearFilters}>
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForumList; 