import React, { useState, useEffect } from 'react';
import axios from "../../config/configAxios";
import { Link } from 'react-router-dom';
import { MessageSquare, Users, ArrowRight } from 'react-feather';
import { Container, Row, Col } from 'react-bootstrap';
import Filtros from '../../components/filters/filtros';
import SearchBar from '../../components/textFields/search';
import './forumList.css';

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState({ S: false, A: false });
  const [estadoSelecionado, setEstadoSelecionado] = useState({ porComecar: false, emCurso: false, terminado: false });
  const [dataSelecionada, setDataSelecionada] = useState({ inicio: '', fim: '' });
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

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const clearFilters = () => {
    setSearchTerm('');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    // Mantido para compatibilidade com o componente SearchBar
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
              estadoSelecionado={estadoSelecionado}
              setEstadoSelecionado={setEstadoSelecionado}
              dataSelecionada={dataSelecionada}
              setDataSelecionada={setDataSelecionada}
              mostrarTipo={true}
              mostrarEstado={true}
              mostrarData={true}
            />
          </Col>

          {/* Conteúdo principal */}
          <Col lg={9} md={12}>
            <div className="forum-header-actions">
              <div className="forum-count">
                {forums.length === 1 ? (
                  <span>1 fórum encontrado</span>
                ) : (
                  <span>{forums.length} fóruns encontrados</span>
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

            <div className="forum-grid">
              {forums.map((forum) => (
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForumList; 