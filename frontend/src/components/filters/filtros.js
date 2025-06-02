import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "react-bootstrap-icons";
import axios from "../../config/configAxios";
import "./filtros.css";

function FiltrosCursos({
    tipoSelecionado = { S: false, A: false },
    setTipoSelecionado,
    certSelecionado = { C: false, S: false },
    setCertSelecionado,
    estadoSelecionado = { porComecar: false, emCurso: false, terminado: false },
    setEstadoSelecionado,
    dataSelecionada = { inicio: '', fim: '' },
    setDataSelecionada,
    nivelSelecionado = { 1: false, 2: false, 3: false, 4: false },
    setNivelSelecionado,
    categoriaSelecionada,
    setCategoriaSelecionada,
    areaSelecionada,
    setAreaSelecionada,
    topicoSelecionado,
    setTopicoSelecionado,
    mostrarTipo = true,
    mostrarEstado = true,
    mostrarData = false,
    mostrarNivel = true,
    mostrarCategoria = false,
    mostrarCertificado = false,
}) {
    const [tipoAberto, setTipoAberto] = useState(true);
    const [certAberto, setCertAberto] = useState(true);
    const [estadoAberto, setEstadoAberto] = useState(true);
    const [filtersExpanded, setFiltersExpanded] = useState(true);
    const [dataAberto, setDataAberto] = useState(true);
    const [nivelAberto, setNivelAberto] = useState(true);
    const [categoriaAberta, setCategoriaAberta] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [loadingCategorias, setLoading] = useState(false);
    const [errorCategorias, setError] = useState(null);

    const fetchCategorias = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/categoria");
            setCategorias(response.data);
            setError(null);
        } catch (err) {
            console.error("Erro ao obter categorias:", err);
            setError("Falha ao carregar categorias");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCategorias();
    }, []);

    // Toggle individual filter value
    const toggleTipo = (tipo) => {
        setTipoSelecionado((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
    };

    const toggleCert = (cert) => {
        setCertSelecionado((prev) => ({ ...prev, [cert]: !prev[cert] }));
    };

    const toggleEstado = (estado) => {
        setEstadoSelecionado((prev) => ({ ...prev, [estado]: !prev[estado] }));
    };

    const toggleNivel = (nivel) => {
        setNivelSelecionado((prev) => ({ ...prev, [nivel]: !prev[nivel] }));
    };
    const niveisTexto = {
        1: "Iniciante",
        2: "Intermédio",
        3: "Avançado",
        4: "Expert",
    };

    const toggleCheckbox = (id, list, setList) => {
        const safeList = list ?? [];
        if (safeList.includes(id)) {
            setList(safeList.filter(item => item !== id));
        } else {
            setList([...safeList, id]);
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setTipoSelecionado({ S: false, A: false });
        setCertSelecionado({ C: false, S: false });
        setEstadoSelecionado({ porComecar: false, emCurso: false, terminado: false });
        setDataSelecionada({ inicio: '', fim: '' });
        setNivelSelecionado({ 1: false, 2: false, 3: false, 4: false });
        if((categoriaSelecionada || areaSelecionada || topicoSelecionado) !== undefined){
        setCategoriaSelecionada(null);
        setAreaSelecionada(null);
        setTopicoSelecionado([]);
        }
    }

    // Count active filters
    const getActiveFiltersCount = () => {
        const selectedTipos = tipoSelecionado ? Object.values(tipoSelecionado).filter(Boolean).length : 0;
        const selectedCert = certSelecionado ? Object.values(certSelecionado).filter(Boolean).length : 0;
        const selectedEstados = estadoSelecionado ? Object.values(estadoSelecionado).filter(Boolean).length : 0;
        const dataAtiva = (dataSelecionada?.inicio || dataSelecionada?.fim) ? 1 : 0;
        const selectedNiveis = nivelSelecionado ? Object.values(nivelSelecionado).filter(Boolean).length : 0;
        const selectedCategorias = categoriaSelecionada != null ? 1 : 0;
        const selectedAreas = areaSelecionada != null ? 1 : 0;
        const selectedTopicos = topicoSelecionado?.length || 0;
        return selectedTipos + selectedCert + selectedEstados + selectedNiveis + dataAtiva + selectedCategorias + selectedAreas + selectedTopicos;
    };

    const activeCount = getActiveFiltersCount();

    return (
        <div className="filtros-container-wrapper">
            <div
                className="filtros-mobile-toggle"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
            >
                <div className="filtros-title">
                    <Filter size={18} />
                    <h3>Filtros</h3>
                    {activeCount > 0 && (
                        <span className="active-filters-badge">{activeCount}</span>
                    )}
                </div>
                {filtersExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            <div className={`filtros-content ${filtersExpanded ? 'expanded' : ''} ${activeCount > 0 ? 'with-padding-top' : ''}`}>
                {/* Botão agora sempre presente, mas com classe visible controlando a visibilidade */}
                {activeCount > 0 && (
                    <button
                        className={`reset-filters-btn ${activeCount > 0 ? 'visible' : ''}`}
                        onClick={resetFilters}
                    >
                        <X size={14} />
                        <span>Limpar filtros</span>
                    </button>
                )}

                <h4 className="filtros-section-title">Filtros</h4>

                {/* Tipo Curso */}
                {mostrarTipo && (<div className="filtro-box">
                    <div
                        className={`filtro-header ${tipoAberto ? 'active' : ''}`}
                        onClick={() => setTipoAberto(!tipoAberto)}
                    >
                        <span className="filtro-title">Tipo de Curso</span>
                        {tipoAberto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    <div className={`filtro-opcoes ${tipoAberto ? 'visible' : ''}`}>
                        <div className="checkbox-option">
                            <div className="checkbox-wrapper-13">
                                <input
                                    id="tipo-sincrono"
                                    type="checkbox"
                                    checked={tipoSelecionado.S}
                                    onChange={() => toggleTipo("S")}
                                />
                                <label htmlFor="tipo-sincrono">Síncrono</label>
                            </div>
                        </div>
                        <div className="checkbox-option">
                            <div className="checkbox-wrapper-13">
                                <input
                                    id="tipo-assincrono"
                                    type="checkbox"
                                    checked={tipoSelecionado.A}
                                    onChange={() => toggleTipo("A")}
                                />
                                <label htmlFor="tipo-assincrono">Assíncrono</label>
                            </div>
                        </div>
                    </div>
                </div>)}

                {/* Certificação */}
                {mostrarCertificado && (<div className="filtro-box">
                    <div
                        className={`filtro-header ${certAberto ? 'active' : ''}`}
                        onClick={() => setCertAberto(!certAberto)}
                    >
                        <span className="filtro-title">Certificação</span>
                        {certAberto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    <div className={`filtro-opcoes ${certAberto ? 'visible' : ''}`}>
                        <div className="checkbox-option">
                            <div className="checkbox-wrapper-13">
                                <input
                                    id="com-certificado"
                                    type="checkbox"
                                    checked={certSelecionado.C}
                                    onChange={() => toggleCert("C")}
                                />
                                <label htmlFor="com-certificado">Com Certificação</label>
                            </div>
                        </div>
                        <div className="checkbox-option">
                            <div className="checkbox-wrapper-13">
                                <input
                                    id="sem-certificado"
                                    type="checkbox"
                                    checked={certSelecionado.S}
                                    onChange={() => toggleCert("S")}
                                />
                                <label htmlFor="sem-certificado">Sem Certificação</label>
                            </div>
                        </div>
                    </div>
                </div>)}

                {/* Estado Curso */}
                {mostrarEstado && (<div className="filtro-box">
                    <div
                        className={`filtro-header ${estadoAberto ? 'active' : ''}`}
                        onClick={() => setEstadoAberto(!estadoAberto)}
                    >
                        <span className="filtro-title">Estado do Curso</span>
                        {estadoAberto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    <div className={`filtro-opcoes ${estadoAberto ? 'visible' : ''}`}>
                        <div className="checkbox-option">
                            <div className="checkbox-wrapper-13">
                                <input
                                    id="estado-por-comecar"
                                    type="checkbox"
                                    checked={estadoSelecionado.porComecar}
                                    onChange={() => toggleEstado("porComecar")}
                                />
                                <label htmlFor="estado-por-comecar">Por Começar</label>
                            </div>
                        </div>
                        <div className="checkbox-option">
                            <div className="checkbox-wrapper-13">
                                <input
                                    id="estado-em-curso"
                                    type="checkbox"
                                    checked={estadoSelecionado.emCurso}
                                    onChange={() => toggleEstado("emCurso")}
                                />
                                <label htmlFor="estado-em-curso">Em Curso</label>
                            </div>
                        </div>
                        <div className="checkbox-option">
                            <div className="checkbox-wrapper-13">
                                <input
                                    id="estado-terminado"
                                    type="checkbox"
                                    checked={estadoSelecionado.terminado}
                                    onChange={() => toggleEstado("terminado")}
                                />
                                <label htmlFor="estado-terminado">Concluído</label>
                            </div>
                        </div>
                    </div>
                </div>)}

                {mostrarNivel && <div className="filtro-box">
                    <div
                        className={`filtro-header ${nivelAberto ? 'active' : ''}`}
                        onClick={() => setNivelAberto(!nivelAberto)}
                    >
                        <span className="filtro-title">Nível</span>
                        {nivelAberto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    <div className={`filtro-opcoes ${nivelAberto ? 'visible' : ''}`}>
                        {[1, 2, 3, 4].map((nivel) => (
                            <div key={nivel} className="checkbox-option">
                                <div className="checkbox-wrapper-13">
                                    <input
                                        id={`nivel-${nivel}`}
                                        type="checkbox"
                                        checked={nivelSelecionado[nivel]}
                                        onChange={() => toggleNivel(nivel)}
                                    />
                                    <label htmlFor={`nivel-${nivel}`}>Nível {nivel}- {niveisTexto[nivel]}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                }

                {/* Data de inicio */}
                {mostrarData && (
                    <div className="filtro-box">
                        <div
                            className={`filtro-header ${dataAberto ? 'active' : ''}`}
                            onClick={() => setDataAberto(!dataAberto)}
                        >
                            <span className="filtro-title">Data de Início</span>
                            {dataAberto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        <div className={`filtro-opcoes ${dataAberto ? 'visible' : ''}`}>
                            <div className="date-input-wrapper">
                                <div className="date-range-inputs">
                                    <label>De:</label>
                                    <input
                                        type="date"
                                        value={dataSelecionada.inicio}
                                        max={dataSelecionada.fim || undefined}
                                        onChange={(e) =>
                                            setDataSelecionada(prev => ({ ...prev, inicio: e.target.value }))
                                        }
                                        className="form-control"
                                    />

                                    <label>Até:</label>
                                    <input
                                        type="date"
                                        value={dataSelecionada.fim}
                                        min={dataSelecionada.inicio || undefined}
                                        onChange={(e) =>
                                            setDataSelecionada(prev => ({ ...prev, fim: e.target.value }))
                                        }
                                        className="form-control"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Categoria */}
                {mostrarCategoria && (
                <div className="filtro-box">
                    <div
                        className={`filtro-header ${categoriaAberta ? 'active' : ''}`}
                        onClick={() => setCategoriaAberta(!categoriaAberta)}
                    >
                        <span className="filtro-title">Categorias</span>
                        {categoriaAberta ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    <div className={`filtro-opcoes ${categoriaAberta ? 'visible' : ''}`}>
                        {(categorias ?? []).map(cat => (
                            <div key={cat.categoria_id} className="checkbox-option">
                                <div className="checkbox-wrapper-13">
                                    <input
                                        id={`cat-${cat.categoria_id}`}
                                        type="checkbox"
                                        checked={categoriaSelecionada === cat.categoria_id}
                                        onChange={() => {
                                            setCategoriaSelecionada(prev =>
                                                prev === cat.categoria_id ? null : cat.categoria_id
                                            );
                                            setAreaSelecionada(null);
                                            setTopicoSelecionado([]);
                                        }}
                                    />
                                    <label htmlFor={`cat-${cat.categoria_id}`}>{cat.descricao}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

                {categoriaSelecionada && (
                    <div className="filtro-box">
                        <div className="filtro-header active">
                            <span className="filtro-title">Áreas</span>
                        </div>
                        <div className="filtro-opcoes visible">
                            {(categorias.find(cat => cat.categoria_id === categoriaSelecionada)?.categoria_areas ?? [])
                                .map(area => (
                                    <div key={area.area_id} className="checkbox-option">
                                        <div className="checkbox-wrapper-13">
                                            <input
                                                id={`area-${area.area_id}`}
                                                type="checkbox"
                                                checked={areaSelecionada === area.area_id}
                                                onChange={() => {
                                                    setAreaSelecionada(prev =>
                                                        prev === area.area_id ? null : area.area_id
                                                    );
                                                    setTopicoSelecionado([]);
                                                }}
                                            />
                                            <label htmlFor={`area-${area.area_id}`}>{area.descricao}</label>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {areaSelecionada != null && areaSelecionada !== '' && (
                    <div className="filtro-box">
                        <div className="filtro-header active">
                            <span className="filtro-title">Tópicos</span>
                        </div>
                        <div className="filtro-opcoes visible">
                            {(categorias ?? [])
                                .flatMap(cat => cat.categoria_areas ?? [])
                                .filter(area => area.area_id === areaSelecionada)
                                .flatMap(area => area.area_topicos ?? [])
                                .map(topico => (
                                    <div key={topico.topico_id} className="checkbox-option">
                                        <div className="checkbox-wrapper-13">
                                            <input
                                                id={`topico-${topico.topico_id}`}
                                                type="checkbox"
                                                checked={(topicoSelecionado ?? []).includes(topico.topico_id)}
                                                onChange={() => toggleCheckbox(topico.topico_id, topicoSelecionado, setTopicoSelecionado)}
                                            />
                                            <label htmlFor={`topico-${topico.topico_id}`}>{topico.descricao}</label>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default FiltrosCursos;