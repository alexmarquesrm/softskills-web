import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Book, AlertCircle } from 'react-feather';
import axios from "../../config/configAxios";
/* COMPONENTES */
import FeaturedCourses from "../../components/cards/cardCourses";
import SearchBar from '../../components/textFields/search';
import Filtros from '../../components/filters/filtros';

export default function CoursesManage() {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoSelecionado, setTipoSelecionado] = useState({ S: false, A: false });
    const [estadoSelecionado, setEstadoSelecionado] = useState({ porComecar: false, emCurso: false, terminado: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);
    const [formadorNome, setFormadorNome] = useState('');

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const formadorId = sessionStorage.getItem('colaboradorid');
            
            const response = await axios.get(`/curso/formador/${formadorId}`, {
                headers: { Authorization: `${token}` }
            });
            
            setCursos(response.data);
            
            // Get formador name if available from first course
            if (response.data.length > 0 && 
                response.data[0].curso_sincrono?.[0]?.sincrono_formador?.formador_colab?.nome) {
                setFormadorNome(response.data[0].curso_sincrono[0].sincrono_formador.formador_colab.nome);
            }
            
        } catch (error) {
            console.error("Erro ao carregar cursos:", error);
            setError("Não foi possível carregar os cursos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Memoized filtered courses for better performance
    const filteredCursos = useMemo(() => {
        if (cursos.length === 0) return [];

        const now = new Date();
        const anyEstadoSelected = estadoSelecionado.emCurso || estadoSelecionado.terminado || estadoSelecionado.porComecar;

        return cursos.filter(curso => {
            const dataInicio = curso?.curso_sincrono?.data_inicio ? new Date(curso.curso_sincrono.data_inicio) : null;
            const isConcluido = curso.estado;
            const isPorComecar = dataInicio && dataInicio > now;
            const isEmCurso = !isConcluido && (!isPorComecar || !dataInicio);

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
                    // ok
                } else {
                    return false;
                }
            }

            // Filter by search term
            if (searchTerm.trim() !== '') {
                const searchLower = searchTerm.toLowerCase();
                return (
                    curso.titulo?.toLowerCase().includes(searchLower) ||
                    curso.descricao?.toLowerCase().includes(searchLower) ||
                    curso.curso_sincrono?.[0]?.sincrono_formador?.formador_colab?.nome?.toLowerCase().includes(searchLower) ||
                    curso.curso_topico?.[0]?.descricao?.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });
    }, [cursos, estadoSelecionado, searchTerm]);

    // Stats calculation
    const stats = useMemo(() => {
        if (cursos.length === 0) return { total: 0, emCurso: 0, terminados: 0 };

        const total = cursos.length;
        const terminados = cursos.filter(curso => 
            curso.curso_sincrono?.[0]?.estado === true
        ).length;
        const emCurso = total - terminados;

        return { total, emCurso, terminados };
    }, [cursos]);

    // Handler for course selection
    const handleCourseSelect = (selectedCourse) => {
        navigate(`/formador/curso/${selectedCourse.curso_id}`, { 
            state: { id: selectedCourse.curso_id } 
        });
    };

    const renderCourseCard = (curso, index) => {
        // Transform data to match the CardCourses component expectations
        const cursoData = {
            ...curso,
            sincrono: curso.curso_sincrono?.[0] ? {
                formador: curso.curso_sincrono[0].sincrono_formador,
                estado: curso.curso_sincrono[0].estado,
                inicio: curso.curso_sincrono[0].data_inicio,
                fim: curso.curso_sincrono[0].data_fim,
                vagas: curso.curso_sincrono[0].limite_vagas
            } : null
        };
        
        return (
            <div key={curso.curso_id || index} className="course-card-wrapper" onClick={() => handleCourseSelect(curso)}>
                <FeaturedCourses curso={cursoData} mostrarBotao={true} mostrarInicioEFim={true}/>
            </div>
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        // Kept for compatibility with SearchBar component
    };

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    // Function to clear filters
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
                            <h1 className="percurso-title">Cursos a lecionar</h1>
                            {formadorNome && <h2 className="percurso-user-name">{formadorNome}</h2>}
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
                        <div className="percurso-stat-item terminados">
                            <span className="stat-value">{stats.terminados}</span>
                            <span className="stat-label">Terminados</span>
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
                            mostrarTipo={false}
                            mostrarEstado={true}
                        />
                    </Col>

                    {/* Conteúdo principal */}
                    <Col lg={9} md={12} className="main-content">
                        <div className="courses-header">
                            <div className="courses-count">
                                {filteredCursos.length === 1 ? (
                                    <span>1 curso encontrado</span>
                                ) : (
                                    <span>{filteredCursos.length} cursos encontrados</span>
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
                            {filteredCursos.length > 0 ? (
                                <div className="courses-grid">
                                    {filteredCursos.map((curso, index) =>
                                        renderCourseCard(curso, index)
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