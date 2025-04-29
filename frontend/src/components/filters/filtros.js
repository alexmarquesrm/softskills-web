import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "react-bootstrap-icons";
import "./filtros.css";

function FiltrosCursos({
    tipoSelecionado,
    setTipoSelecionado,
    estadoSelecionado,
    setEstadoSelecionado,
    mostrarTipo = true,
    mostrarEstado = true
}) {
    const [tipoAberto, setTipoAberto] = useState(true);
    const [estadoAberto, setEstadoAberto] = useState(true);
    const [filtersExpanded, setFiltersExpanded] = useState(true);

    // Toggle individual filter value
    const toggleTipo = (tipo) => {
        setTipoSelecionado((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
    };

    const toggleEstado = (estado) => {
        setEstadoSelecionado((prev) => ({ ...prev, [estado]: !prev[estado] }));
    };

    // Reset all filters
    const resetFilters = () => {
        setTipoSelecionado({ S: false, A: false });
        setEstadoSelecionado({ emCurso: false, terminado: false });
    };

    // Count active filters
    const getActiveFiltersCount = () => {
        // Contamos apenas os filtros que estão selecionados (true)
        const selectedTipos = Object.values(tipoSelecionado).filter(value => value).length;
        const selectedEstados = Object.values(estadoSelecionado).filter(value => value).length;

        return selectedTipos + selectedEstados;
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

            <div className={`filtros-content ${filtersExpanded ? 'expanded' : ''}`}>
                {/* Botão agora sempre presente, mas com classe visible controlando a visibilidade */}
                <button
                    className={`reset-filters-btn ${activeCount > 0 ? 'visible' : ''}`}
                    onClick={resetFilters}
                >
                    <X size={14} />
                    <span>Limpar filtros</span>
                </button>

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
                                <label htmlFor="estado-terminado">Terminado</label>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    );
}

export default FiltrosCursos;