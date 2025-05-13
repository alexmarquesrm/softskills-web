import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Book, AlertCircle, Edit, Trash2 } from 'react-feather';
import axios from "../../config/configAxios";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
/* COMPONENTES */
import FeaturedCourses from "../../components/cards/cardCourses";
import SearchBar from '../../components/textFields/search';
import Filtros from '../../components/filters/filtros';
import Adicionar from "../../components/buttons/saveButton";
/* CSS */
import './percursoFormativo.css';

export default function CourseManage() {
    const navigate = useNavigate();
    const [curso, setCurso] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const tipoUser = sessionStorage.getItem('tipo');
    const [tipoSelecionado, setTipoSelecionado] = useState({ S: false, A: false });
    const [estadoSelecionado, setEstadoSelecionado] = useState({ emCurso: false, terminado: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);
    const [editMode, setEditMode] = useState(false); // Novo estado para controlar o modo de edição
    
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

        // Verificar se algum filtro está ativo
        const anyTipoSelected = tipoSelecionado.S || tipoSelecionado.A;
        const anyEstadoSelected = estadoSelecionado.emCurso || estadoSelecionado.terminado;

        return curso.filter(item => {
            // Filtrar por tipo de curso - só aplica se algum tipo estiver selecionado
            if (anyTipoSelected) {
                if (item?.tipo === 'S' && !tipoSelecionado.S) return false;
                if (item?.tipo === 'A' && !tipoSelecionado.A) return false;
            }

            // Filtrar por estado - só aplica se algum estado estiver selecionado
             if (anyEstadoSelected) {
                if (!item.curso_sincrono?.estado && !estadoSelecionado.emCurso) return false;
                if (item.curso_sincrono?.estado && !estadoSelecionado.terminado) return false;
            } 

            // Filtrar por termo de pesquisa
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

    // Stats
    const stats = useMemo(() => {
        if (curso.length === 0) return { total: 0, emCurso: 0, terminados: 0 };

        const total = curso.length;
        const terminados = curso.filter(item => item.curso_sincrono?.estado).length;
        const emCurso = total - terminados;

        return { total, emCurso };
    }, [curso]);

    // Função para eliminar um curso
    const handleDeleteCourse = async (courseId) => {
        if (window.confirm("Tem certeza que deseja eliminar este curso?")) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.delete(`/curso/apagar/${courseId}`, {
                    headers: { Authorization: `${token}` }
                });
                // Atualizar a lista de cursos após eliminar
                fetchData();
                alert("Curso eliminado com sucesso!");
            } catch (error) {
                console.error("Erro ao eliminar curso", error);
                alert("Não foi possível eliminar o curso. Tente novamente.");
            }
        }
    };

    // Função para editar um curso
    const handleEditCourse = (courseId) => {
        navigate(`/gestor/cursos/edit/${courseId}`);
    };

    const renderCourseCard = (curso, index) => {
        if (editMode) {
            // Versão do card com opções de edição
            return (
                <div key={curso.curso_id || index} className="course-card-edit-wrapper">
                    <FeaturedCourses curso={curso} mostrarBotao={false} />
                    <div className="course-edit-options">
                        <button 
                            className="edit-course-btn"
                            onClick={() => handleEditCourse(curso.curso_id)}
                        >
                            <Edit size={18} />
                        </button>
                        <button 
                            className="delete-course-btn"
                            onClick={() => handleDeleteCourse(curso.curso_id)}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            );
        }
        // Versão normal do card
        return <FeaturedCourses key={curso.curso_id || index} curso={curso} mostrarBotao={true} />;
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

    // Função para alternar o modo de edição
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    // Função para limpar filtros modificada
    const clearFilters = () => {
        setTipoSelecionado({ S: false, A: false });
        setEstadoSelecionado({ emCurso: false, terminado: false });
        setSearchTerm('');
    };

    // Função para tratar a navegação do botão "Adicionar Curso"
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

                            <div className="search-container" style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                                {tipoUser === "Gestor" && (
                                    <>
                                        {/* Botão vermelho de editar */}
                                        <button 
                                            className={`edit-mode-btn ${editMode ? 'active' : ''}`}
                                            onClick={toggleEditMode}
                                            style={{
                                                background: editMode ? "#b30000" : "#ff0000",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                padding: "8px 16px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <Edit size={16} />
                                            {editMode ? "Cancelar Edição" : "Editar"}
                                        </button>
                                        
                                        <Adicionar
                                            text={"Novo Curso"}
                                            onClick={handleAddCourse}
                                            Icon={IoMdAdd}
                                        />
                                    </>
                                )}
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
                                <div className={`courses-grid ${editMode ? 'edit-mode' : ''}`}>
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