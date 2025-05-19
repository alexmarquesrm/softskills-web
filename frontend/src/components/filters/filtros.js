import React, { useState } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "react-bootstrap-icons";
import "./filtros.css";

function FiltrosCursos({
    tipoSelecionado = { S: false, A: false },
    setTipoSelecionado,
    estadoSelecionado = { porComecar: false, emCurso: false, terminado: false },
    setEstadoSelecionado,
    dataSelecionada = { inicio: '', fim: '' },
    setDataSelecionada,
    nivelSelecionado = { 1: false, 2: false, 3: false, 4: false },
    setNivelSelecionado,
    mostrarTipo = true,
    mostrarEstado = true,
    mostrarData = false
}) {
    const [tipoAberto, setTipoAberto] = useState(true);
    const [estadoAberto, setEstadoAberto] = useState(true);
    const [filtersExpanded, setFiltersExpanded] = useState(true);
    const [dataAberto, setDataAberto] = useState(true);
    const [nivelAberto, setNivelAberto] = useState(true);

    // Toggle individual filter value
    const toggleTipo = (tipo) => {
        setTipoSelecionado((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
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

    // Reset all filters
    const resetFilters = () => {
        setTipoSelecionado({ S: false, A: false });
        setEstadoSelecionado({ porComecar: false, emCurso: false, terminado: false });
        setDataSelecionada({ inicio: '', fim: '' });
        setNivelSelecionado({ 1: false, 2: false, 3: false, 4: false });
    }

    // Count active filters
    const getActiveFiltersCount = () => {
        const selectedTipos = tipoSelecionado ? Object.values(tipoSelecionado).filter(Boolean).length : 0;
        const selectedEstados = estadoSelecionado ? Object.values(estadoSelecionado).filter(Boolean).length : 0;
        const dataAtiva = (dataSelecionada?.inicio || dataSelecionada?.fim) ? 1 : 0;
        const selectedNiveis = nivelSelecionado ? Object.values(nivelSelecionado).filter(Boolean).length : 0;
        return selectedTipos + selectedEstados + selectedNiveis + dataAtiva;
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

                <div className="filtro-box">
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
            </div>
        </div>
    );
}

export default FiltrosCursos;