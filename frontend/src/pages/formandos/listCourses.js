import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import { Book, AlertCircle } from 'react-feather';
import axios from "../../config/configAxios";
import { useSearchParams } from 'react-router-dom';
/* COMPONENTES */
import FeaturedCourses from "../../components/cards/cardCourses";
import SearchBar from '../../components/textFields/search';
import Filtros from '../../components/filters/filtros';
import { filtrarCursosOuInscricoes } from '../../utils/filtrarCursos';

export default function Courses() {
    const [curso, setCurso] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [inscricao, setInscricao] = useState([]);
    const [inscricaoCarregada, setInscricaoCarregada] = useState(false);
    const [tipoSelecionado, setTipoSelecionado] = useState({ S: false, A: false });
    const [certSelecionado, setCertSelecionado] = useState({ C: false, S: false });
    const [estadoSelecionado, setEstadoSelecionado] = useState({ emCurso: false, terminado: false });
    const [dataSelecionada, setDataSelecionada] = useState({ inicio: '', fim: '' });
    const [nivelSelecionado, setNivelSelecionado] = useState({ 1: false, 2: false, 3: false, 4: false });
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [areaSelecionada, setAreaSelecionada] = useState(null);
    const [topicoSelecionado, setTopicoSelecionado] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const coursesPerPage = 8;

    const fetchDataInscricao = async () => {
        try {
            const response = await axios.get('/inscricao/minhas');
            setInscricao(response.data);
        } catch (err) {
            console.error("Erro ao carregar curso:", err);
            setError("Erro ao carregar os dados do curso");
            setLoading(false);
        } finally {
            setInscricaoCarregada(true);
        }
    };

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`/curso`, {
                headers: { Authorization: `${token}` }
            });
            const cursos = response.data;

            // Apenas cursos que ainda têm vagas disponíveis
            const cursosComVagas = cursos.filter(curso => {
                return curso.tipo === 'A' || (parseInt(curso.vagas_disponiveis) > 0);
            });
            // Pegamos os ids dos cursos já inscritos
            const cursosInscritosIds = inscricao.map(i => i.curso_id);
            // Filtramos os cursos onde o id não está nas inscrições
            const cursosNaoInscritos = cursosComVagas.filter(
                (curso) => !cursosInscritosIds.includes(curso.curso_id)
            );

            setCurso(cursosNaoInscritos);
        } catch (error) {
            console.error("Erro ao procurar inscrições", error);
            setError("Não foi possível carregar as inscrições");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const categoriaIdFromUrl = searchParams.get('categoriaId');
        const areaIdFromUrl = searchParams.get('areaId');
        const topicoIdFromUrl = searchParams.get('topicoId');

        setCategoriaSelecionada(categoriaIdFromUrl ? Number(categoriaIdFromUrl) : null);
        setAreaSelecionada(areaIdFromUrl ? Number(areaIdFromUrl) : null);
        setTopicoSelecionado(topicoIdFromUrl ? [Number(topicoIdFromUrl)] : []);
    }, [searchParams]);


    useEffect(() => {
        fetchDataInscricao();
    }, []);

    useEffect(() => {
        if (inscricaoCarregada) {
            fetchData();
        }
    }, [inscricaoCarregada]);

    // Memoizar inscrições filtradas para melhorar desempenho
    const filteredInscricoes = useMemo(() => {
        const cursosValidos = curso.filter(item => {
            if (item.tipo === 'S') {
                const dataLimite = item.curso_sincrono?.data_limite_inscricao;
                return dataLimite && new Date(dataLimite) > new Date();
            }
            return true;
        });
        
        return filtrarCursosOuInscricoes({
            dados: cursosValidos,
            tipoSelecionado,
            certSelecionado,
            estadoSelecionado,
            dataSelecionada,
            nivelSelecionado,
            searchTerm,
            categoriaSelecionada,
            areaSelecionada,
            topicoSelecionado,
            modo: 'curso'
        });
    }, [curso, tipoSelecionado, certSelecionado, estadoSelecionado, dataSelecionada, nivelSelecionado, categoriaSelecionada, areaSelecionada, topicoSelecionado, searchTerm]);

    const stats = useMemo(() => {
        if (curso.length === 0) return { total: 0, emCurso: 0, terminados: 0 };

        const porComecar = curso.filter(item => {
            const estado = item.curso_sincrono?.estado === false;
            const dataInicio = new Date(item.curso_sincrono?.data_inicio);
            const dataAtual = new Date();
            return estado && dataInicio > dataAtual;
        }).length;
        const assincrono = curso.filter(curso => curso.tipo === 'A' && curso.pendente === false).length;

        const total = porComecar + assincrono;

        return { total };
    }, [curso]);

    const renderCourseCard = (curso, index) => (
        <FeaturedCourses key={curso.curso_id || index} curso={curso} mostrarEstado={false} mostrarBotao={true} mostrarCertificado={true}  mostrarNivelCard={true} mostrarVagas={true}/>
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
        setCertSelecionado({ C: false, S: false });
        setEstadoSelecionado({ emCurso: false, terminado: false });
        setDataSelecionada({ inicio: '', fim: '' });
        setNivelSelecionado({ 1: false, 2: false, 3: false, 4: false });
        setCategoriaSelecionada(null);
        setAreaSelecionada(null);
        setTopicoSelecionado([]);
        setSearchTerm('');
    };

    // Pagination logic
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredInscricoes.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredInscricoes.length / coursesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                            <h1 className="percurso-title">Cursos Disponiveis</h1>
                        </div>
                    </div>

                    <div className="percurso-stats">
                        <div className="percurso-stat-item">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total de Cursos</span>
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
                            mostrarTipo={true}
                            mostrarEstado={false}
                            mostrarData={true}
                            mostrarCategoria={true}
                            mostrarCertificado={true}
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
                                <>
                                    <div className="courses-grid">
                                        {currentCourses.map((item, index) =>
                                            renderCourseCard(item, index)
                                        )}
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="pagination-container">
                                            <Pagination>
                                                <Pagination.First
                                                    onClick={() => handlePageChange(1)}
                                                    disabled={currentPage === 1}
                                                />
                                                <Pagination.Prev
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                />

                                                {[...Array(totalPages)].map((_, index) => {
                                                    const pageNumber = index + 1;
                                                    // Show first page, last page, current page, and pages around current page
                                                    if (
                                                        pageNumber === 1 ||
                                                        pageNumber === totalPages ||
                                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <Pagination.Item
                                                                key={pageNumber}
                                                                active={pageNumber === currentPage}
                                                                onClick={() => handlePageChange(pageNumber)}
                                                            >
                                                                {pageNumber}
                                                            </Pagination.Item>
                                                        );
                                                    } else if (
                                                        pageNumber === currentPage - 2 ||
                                                        pageNumber === currentPage + 2
                                                    ) {
                                                        return <Pagination.Ellipsis key={pageNumber} disabled />;
                                                    }
                                                    return null;
                                                })}

                                                <Pagination.Next
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                />
                                                <Pagination.Last
                                                    onClick={() => handlePageChange(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                />
                                            </Pagination>
                                        </div>
                                    )}
                                </>
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