import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import "./filtros.css";

function FiltrosCursos({
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
                        <div className="checkbox-wrapper-13">
                            <input
                                id="tipo-sincrono"
                                type="checkbox"
                                checked={tipoSelecionado.S}
                                onChange={() => toggleTipo("S")}
                            />
                            <label htmlFor="tipo-sincrono" className="titulo-limitado">Síncrono</label>
                        </div>
                        <div className="checkbox-wrapper-13">
                            <input
                                id="tipo-assincrono"
                                type="checkbox"
                                checked={tipoSelecionado.A}
                                onChange={() => toggleTipo("A")}
                            />
                            <label htmlFor="tipo-assincrono" className="titulo-limitado">Assíncrono</label>
                        </div>
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
                        <div className="checkbox-wrapper-13">
                            <input
                                id="estado-em-curso"
                                type="checkbox"
                                checked={estadoSelecionado.emCurso}
                                onChange={() => toggleEstado("emCurso")}
                            />
                            <label htmlFor="estado-em-curso" className="titulo-limitado">Em Curso</label>
                        </div>
                        <div className="checkbox-wrapper-13 ">
                            <input
                                id="estado-terminado"
                                type="checkbox"
                                checked={estadoSelecionado.terminado}
                                onChange={() => toggleEstado("terminado")}
                            />
                            <label htmlFor="estado-terminado" className="titulo-limitado">Terminado</label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FiltrosCursos;