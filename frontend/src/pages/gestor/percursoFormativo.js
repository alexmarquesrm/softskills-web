import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import { Book, AlertCircle, Award, Calendar, User } from 'react-feather';
import axios from "../../config/configAxios";
/* COMPONENTES */
import FeaturedCourses from "../../components/cards/cardCourses";
import SearchBar from '../../components/textFields/search';
import Filtros from '../../components/filters/filtros';
/* CSS */
import './percursoFormativo.css';

export default function PercursoFormativo() {
    const location = useLocation();
    const id = location.state?.id;
    const [nome, setNome] = useState('');
    const [inscricao, setInscricao] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    // Modificando o estado inicial para false (não selecionado)
    const [tipoSelecionado, setTipoSelecionado] = useState({ S: false, A: false });
    const [estadoSelecionado, setEstadoSelecionado] = useState({ emCurso: false, terminado: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);

    // Memorizar dados do colaborador
    const fetchDataColab = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.get(`/colaborador/${id}`, {
                headers: { Authorization: `${token}` },
            });

            const utilizador = response.data;
            setNome(utilizador.nome);
        } catch (error) {
            console.error("Erro ao buscar dados do colaborador", error);
            setError("Não foi possível carregar os dados do colaborador");
        }
    };

    // Buscar dados de inscrição
    const fetchDataInscricao = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`/inscricao/listar`, {
                headers: { Authorization: `${token}` }
            });

            const inscricoesFiltradas = response.data.filter(item => item.formando_id === parseInt(id));
            setInscricao(inscricoesFiltradas);
        } catch (error) {
            console.error("Erro ao buscar inscrições", error);
            setError("Não foi possível carregar as inscrições");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataColab();
        fetchDataInscricao();
    }, [id]);

    // Memoizar inscrições filtradas para melhorar desempenho
    const filteredInscricoes = useMemo(() => {
        if (inscricao.length === 0) return [];

        // Verificar se algum filtro está ativo
        const anyTipoSelected = tipoSelecionado.S || tipoSelecionado.A;
        const anyEstadoSelected = estadoSelecionado.emCurso || estadoSelecionado.terminado;

        return inscricao.filter(item => {
            // Filtrar por tipo de curso - só aplica se algum tipo estiver selecionado
            if (anyTipoSelected) {
                if (item.inscricao_curso?.tipo === 'S' && !tipoSelecionado.S) return false;
                if (item.inscricao_curso?.tipo === 'A' && !tipoSelecionado.A) return false;
            }

            // Filtrar por estado - só aplica se algum estado estiver selecionado
            if (anyEstadoSelected) {
                if (!item.estado && !estadoSelecionado.emCurso) return false;
                if (item.estado && !estadoSelecionado.terminado) return false;
            }

            // Filtrar por termo de pesquisa
            if (searchTerm.trim() !== '') {
                const searchLower = searchTerm.toLowerCase();
                return (
                    item.inscricao_curso?.titulo?.toLowerCase().includes(searchLower) ||
                    item.inscricao_curso?.descricao?.toLowerCase().includes(searchLower) ||
                    (item.inscricao_curso?.sincrono?.formador?.colaborador?.nome?.toLowerCase().includes(searchLower))
                );
            }

            return true;
        });
    }, [inscricao, tipoSelecionado, estadoSelecionado, searchTerm]);

    // Stats
    const stats = useMemo(() => {
        if (inscricao.length === 0) return { total: 0, emCurso: 0, terminados: 0 };

        const total = inscricao.length;
        const terminados = inscricao.filter(item => item.estado).length;
        const emCurso = total - terminados;

        return { total, emCurso, terminados };
    }, [inscricao]);

    const renderCourseCard = (inscricao, index) => (
        <FeaturedCourses key={inscricao.inscricao_id || index} curso={inscricao.inscricao_curso} inscricao={inscricao} mostrarBotao={false}/>
    );

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
        setSearchTerm('');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">A carregar...</span>
                </Spinner>
                <p>A carregar informação...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <AlertCircle size={48} className="text-danger mb-3" />
                <h3>Ocorreu um erro</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="percurso-formativo-page">
            <Container fluid className="page-container">
                {/* Header principal com resumo */}
                <div className="percurso-header">
                    <div className="percurso-header-content">
                        <div className="percurso-header-icon">
                            <Book size={32} />
                        </div>
                        <div className="percurso-header-info">
                            <h1 className="percurso-title">Percurso Formativo</h1>
                            <h2 className="percurso-user-name">{nome}</h2>
                        </div>
                    </div>

                    <div className="percurso-stats">
                        <div className="percurso-stat-item">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total de Cursos</span>
                        </div>
                        <div className="percurso-stat-item em-curso">
                            <span className="stat-value">{stats.emCurso}</span>
                            <span className="stat-label">Em Curso</span>
                        </div>
                        <div className="percurso-stat-item concluido">
                            <span className="stat-value">{stats.terminados}</span>
                            <span className="stat-label">Concluídos</span>
                        </div>
                    </div>
                </div>

                {/* Conteúdo principal - Filtros e Lista de Cursos */}
                <Row className="percurso-content">
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
                        />
                    </Col>

                    {/* Conteúdo principal */}
                    <Col lg={9} md={12} className="main-content">
                        <div className="courses-header">
                            <div className="courses-count">
                                {filteredInscricoes.length === 1 ? (
                                    <span>1 curso encontrado</span>
                                ) : (
                                    <span>{filteredInscricoes.length} cursos encontrados</span>
                                )}
                            </div>

                            <div className="search-container">
                                <SearchBar
                                    searchTerm={searchTerm}
                                    handleSearchChange={handleSearchChange}
                                    handleSearchClick={handleSearchClick}
                                    placeholder="Pesquisar cursos..."
                                />
                            </div>
                        </div>

                        <div className="courses-container">
                            {filteredInscricoes.length > 0 ? (
                                <div className="courses-grid">
                                    {filteredInscricoes.map((item, index) =>
                                        renderCourseCard(item, index)
                                    )}
                                </div>
                            ) : (
                                <div className="no-courses">
                                    <AlertCircle size={36} className="mb-3" />
                                    <p>Não foram encontrados cursos com os filtros selecionados.</p>
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
}