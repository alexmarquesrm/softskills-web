import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Book, AlertCircle } from 'react-feather';
import axios from "../../config/configAxios";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
/* COMPONENTES */
import FeaturedCourses from "../../components/cards/cardCourses";
import SearchBar from '../../components/textFields/search';
import Filtros from '../../components/filters/filtros';
/* CSS */
import './percursoFormativo.css';

export default function CourseManage() {
    const navigate = useNavigate();
    const [curso, setCurso] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const tipoUser = sessionStorage.getItem('tipo');
    const [tipoSelecionado, setTipoSelecionado] = useState({ S: false, A: false });
    const [estadoSelecionado, setEstadoSelecionado] = useState({ porComecar: false, emCurso: false, terminado: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);

    const fetchData = async () => {
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
        fetchData();
    }, []);

    // Memoizar inscrições filtradas para melhorar desempenho
    const filteredInscricoes = useMemo(() => {
        if (curso.length === 0) return [];

        const anyTipoSelected = tipoSelecionado.S || tipoSelecionado.A;
        const now = new Date();
        const anyEstadoSelected = estadoSelecionado.emCurso || estadoSelecionado.terminado || estadoSelecionado.porComecar;

        return curso.filter(item => {
            const dataInicio = item?.curso_sincrono?.data_inicio ? new Date(item.curso_sincrono.data_inicio) : null;
            const isConcluido = item.estado;
            const isPorComecar = dataInicio && dataInicio > now;
            const isEmCurso = !isConcluido && (!isPorComecar || !dataInicio);

            if (anyTipoSelected) {
                if (item?.tipo === 'S' && !tipoSelecionado.S) return false;
                if (item?.tipo === 'A' && !tipoSelecionado.A) return false;
            }

            // Filtro por estado
            if (anyEstadoSelected) {
                if (estadoSelecionado.porComecar && !isPorComecar) return false;
                if (estadoSelecionado.emCurso && !isEmCurso) return false;
                if (estadoSelecionado.terminado && !isConcluido) return false;

                // Garantir que só passa se um dos estados está de acordo
                if (
                    (!estadoSelecionado.porComecar || isPorComecar) &&
                    (!estadoSelecionado.emCurso || isEmCurso) &&
                    (!estadoSelecionado.terminado || isConcluido)
                ) {
                } else {
                    return false;
                }
            }

            if (searchTerm.trim() !== '') {
                const searchLower = searchTerm.toLowerCase();
                return (
                    item?.titulo?.toLowerCase().includes(searchLower) ||
                    item.descricao?.toLowerCase().includes(searchLower) ||
                    (item?.curso_sincrono?.formador?.colaborador?.nome?.toLowerCase().includes(searchLower))
                );
            }

            return true;
        });
    }, [curso, tipoSelecionado, estadoSelecionado, searchTerm]);

    const stats = useMemo(() => {
        if (curso.length === 0) return { total: 0, emCurso: 0, terminados: 0 };

        const total = curso.length;
        const terminados = curso.filter(item => item.curso_sincrono?.estado).length;
        const emCurso = total - terminados;

        return { total, emCurso };
    }, [curso]);

    const renderCourseCard = (curso, index) => {
        return(
        <FeaturedCourses key={curso.curso_id || index} curso={curso} mostrarBotao={false} mostrarBotaoEdit={true}/>
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        // Mantido para compatibilidade com o componente SearchBar
    };

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const clearFilters = () => {
        setTipoSelecionado({ S: false, A: false });
        setEstadoSelecionado({ emCurso: false, terminado: false });
        setSearchTerm('');
    };

    const handleAddCourse = () => {
        if (tipoUser === "Gestor") {
            navigate('/gestor/cursos/add');
        }
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
                            <h1 className="percurso-title">Gestão de Cursos</h1>
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
            
            {/* Botão flutuante para adicionar novo curso */}
            {tipoUser === "Gestor" && (
                <button className="floating-add-button" onClick={handleAddCourse} title="Adicionar Curso">
                    <IoMdAdd size={24} />
                </button>
            )}
        </div>
    );
}