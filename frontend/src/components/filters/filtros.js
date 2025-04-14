import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import "./filtros.css";

export default function FiltrosCursos({
    tipoSelecionado,
    setTipoSelecionado,
    estadoSelecionado,
    setEstadoSelecionado,
}) {
    const [tipoAberto, setTipoAberto] = useState(false);
    const [estadoAberto, setEstadoAberto] = useState(false);

    const toggleTipo = (tipo) => {
        setTipoSelecionado((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
    };

    const toggleEstado = (estado) => {
        setEstadoSelecionado((prev) => ({ ...prev, [estado]: !prev[estado] }));
    };

    return (
        <div className="filtros-container">
            <strong>Filtros:</strong>

            {/* Tipo Curso */}
            <div className="filtro-box">
                <div className="filtro-header" onClick={() => setTipoAberto(!tipoAberto)}>
                    Tipo Curso
                    {tipoAberto ? <ChevronUp /> : <ChevronDown />}
                </div>
                {tipoAberto && (
                    <div className="filtro-opcoes">
                        <label>
                            <input
                                type="checkbox"
                                checked={tipoSelecionado.S}
                                onChange={() => toggleTipo("S")}
                            />
                            <span className="checkbox-custom"></span>
                            Síncrono
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={tipoSelecionado.A}
                                onChange={() => toggleTipo("A")}
                            />
                            <span className="checkbox-custom"></span>
                            Assíncrono
                        </label>
                    </div>
                )}
            </div>

            {/* Estado Curso */}
            <div className="filtro-box">
                <div className="filtro-header" onClick={() => setEstadoAberto(!estadoAberto)}>
                    Estado Curso
                    {estadoAberto ? <ChevronUp /> : <ChevronDown />}
                </div>
                {estadoAberto && (
                    <div className="filtro-opcoes">
                        <label>
                            <input
                                type="checkbox"
                                checked={estadoSelecionado.emCurso}
                                onChange={() => toggleEstado("emCurso")}
                            />
                            <span className="checkbox-custom"></span>
                            Em Curso
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={estadoSelecionado.terminado}
                                onChange={() => toggleEstado("terminado")}
                            />
                            <span className="checkbox-custom"></span>
                            Terminado
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}
