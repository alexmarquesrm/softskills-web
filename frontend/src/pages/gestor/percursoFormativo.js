import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import axios from "../../config/configAxios";
/* COMPONENTES */
import FeaturedCourses from "../../components/cards/cardCourses";
import SearchBar from '../../components/textFields/search';
import CardRow from '../../components/cards/cardRow';
import Filters from '../../components/filters/filtros';
/* CSS */
import './percursoFormativo.css';

export default function PercursoFormativo() {
    const location = useLocation();
    const id = location.state?.id;
    const [nome, setNome] = useState('');
    const [inscricao, setInscricao] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoSelecionado, setTipoSelecionado] = useState({ S: true, A: true });
    const [estadoSelecionado, setEstadoSelecionado] = useState({ emCurso: true, terminado: true });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        }
    };

    const fetchDataInscricao = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`/inscricao/listar`, {
                headers: { Authorization: `${token}` }
            });

            const inscricoesFiltradas = response.data.filter(item => item.formando_id === parseInt(id));
            setInscricao(inscricoesFiltradas);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataColab();
        fetchDataInscricao();
    }, [id]);

    const renderCourseCard = (inscricao, index) => (
        <FeaturedCourses key={inscricao.inscricao_id || index} curso={inscricao.inscricao_curso} inscricao={inscricao} />
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        console.log('Termo de pesquisa:', searchTerm);
    };

    return (
        <div >
            <div className="wrapper-com-filtros">
                <div style={{marginTop: '175px'}}>
                    <Filters
                        tipoSelecionado={tipoSelecionado}
                        setTipoSelecionado={setTipoSelecionado}
                        estadoSelecionado={estadoSelecionado}
                        setEstadoSelecionado={setEstadoSelecionado}
                    />
                </div>
                <div className="conteudo-cardrow">
                <Container style={{marginTop: '48px'}}>
                <h2 className="section-title mb-4">Percurso Formativo de {nome}</h2>
                <div className="flex-grow-1">
                    <SearchBar
                        searchTerm={searchTerm}
                        handleSearchChange={handleSearchChange}
                        handleSearchClick={handleSearchClick}
                    />
                </div>
            </Container>
                    <Container className="my-5">
                        {inscricao.length > 0 ? (
                            <CardRow
                                dados={inscricao}
                                renderCard={renderCourseCard}
                                scrollable={false}
                                colSize={4}
                                align="start"
                            />
                        ) : (
                            <p>Não existem cursos.</p>
                        )}
                    </Container>
                </div>
            </div>

        </div>
    );
}