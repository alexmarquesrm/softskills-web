import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { File } from 'react-feather'; 
import { BsArrowReturnLeft, BsCheckCircle } from "react-icons/bs";
import axios from "../../config/configAxios";
import Cancelar from "../../components/buttons/cancelButton";
import "./pedidos.css"; 

export default function ViewPedido() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
   
    const [pedido, setPedido] = useState(null);
    const [colaborador, setColaborador] = useState(null);
    
    // Dados do (curso ou fórum)
    const [referencia, setReferencia] = useState(null);
    const [tipoReferencia, setTipoReferencia] = useState("");
    const [topico, setTopico] = useState(null);
    const [formador, setFormador] = useState(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                setLoading(true);
                const token = sessionStorage.getItem('token');
                
                // Buscar o pedido pelo ID
              const pedidoRes = await axios.get(`/pedido/${id}`, {
                         headers: { Authorization: `${token}` }
                    });
                setPedido(pedidoRes.data);
                
                // Buscar dados do colaborador
                const colaboradorRes = await axios.get(`/colaborador/${pedidoRes.data.colaborador_id}`, {
                    headers: { Authorization: `${token}` }
                });
                setColaborador(colaboradorRes.data);
                
                // Verificar o tipo do pedido 
                if (pedidoRes.data.tipo === "CURSO") {
                    setTipoReferencia("curso");
                    const cursoRes = await axios.get(`/curso/${pedidoRes.data.referencia_id}`, {
                        headers: { Authorization: `${token}` }
                    });
                    setReferencia(cursoRes.data);
                    
                    // Se for um curso síncrono, buscar dados do formador
                    if (cursoRes.data.tipo === "S" && cursoRes.data.curso_sincrono?.formador_id) {
                        const formadorRes = await axios.get(`/formador/${cursoRes.data.curso_sincrono.formador_id}`, {
                            headers: { Authorization: `${token}` }
                        });
                        setFormador(formadorRes.data);
                    }
                    
                    // Buscar dados do tópico
                    if (cursoRes.data.topico_id) {
                        const topicoRes = await axios.get(`/topico/${cursoRes.data.topico_id}`, {
                            headers: { Authorization: `${token}` }
                        });
                        setTopico(topicoRes.data);
                    }
                } else if (pedidoRes.data.tipo === "FORUM") {
                    setTipoReferencia("forum");
                    const forumRes = await axios.get(`/topico/${pedidoRes.data.referencia_id}`, {
                        headers: { Authorization: `${token}` }
                    });
                    setReferencia(forumRes.data);
                    setTopico(forumRes.data);
                }
                
                setError(null);
            } catch (err) {
                console.error("Erro ao carregar dados do pedido:", err);
                setError("Ocorreu um erro ao carregar os dados do pedido. Por favor, tente novamente.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchPedido();
    }, [id]);

    const aprovarPedido = async () => {
    try {
        setProcessando(true);
        const token = sessionStorage.getItem('token');

        await axios.put(`/pedido/${id}`, {
            pendente: false,
            status: 'APROVADO'
        }, {
            headers: { Authorization: `${token}` }
        });

        setSuccess(true);
        setTimeout(() => navigate('/pedidos'), 2000);
    } catch (err) {
        console.error("Erro ao aprovar pedido:", err);
        setError("Não foi possível aprovar o pedido. Por favor, tente novamente.");
    } finally {
        setProcessando(false);
    }
};

   const recusarPedido = async () => {
    try {
        setProcessando(true);
        const token = sessionStorage.getItem('token');

        await axios.put(`/pedido/${id}`, {
            status: 'RECUSADO'
        }, {
            headers: { Authorization: `${token}` }
        });

        setSuccess(true);
        setTimeout(() => navigate('/pedidos'), 2000);
    } catch (err) {
        console.error("Erro ao recusar pedido:", err);
        setError("Não foi possível recusar o pedido. Por favor, tente novamente.");
    } finally {
        setProcessando(false);
    }
};

    const goBack = () => navigate(-1);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Carregando dados do pedido...</p>
                </div>
            </Container>
        );
    }

    return (
        <div className="view-pedido-page">
            <Container>
                <div className="page-header">
                    <div className="header-left">
                        <div className="title-container">
                            <File size={28} className="title-icon" />
                            <h1>Detalhes do Pedido</h1>
                        </div>
                    </div>
                </div>

                {success && <Alert variant="success">Pedido processado com sucesso! Redirecionando...</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <div className="pedido-info-section mb-4">
                    <h3>Informações do Pedido</h3>
                    <Row>
                        <Col md={6}>
                            <p><strong>ID do Pedido:</strong> {pedido?.pedido_id}</p>
                            <p><strong>Tipo:</strong> {pedido?.tipo === "CURSO" ? "Curso" : "Fórum"}</p>
                            <p><strong>Data do Pedido:</strong> {new Date(pedido?.data).toLocaleString()}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Solicitante:</strong> {colaborador?.nome || `Colaborador ID: ${pedido?.colaborador_id}`}</p>
                            <p><strong>Email:</strong> {colaborador?.email || "N/A"}</p>
                            <p><strong>Status:</strong> <span className="badge bg-warning">Pendente</span></p>
                        </Col>
                    </Row>
                </div>

                {tipoReferencia === "curso" && referencia && (
                    <div className="curso-info-section mb-4">
                        <h3>Informações do Curso</h3>
                        <Row>
                            <Col md={6}>
                                <p><strong>Título:</strong> {referencia.titulo}</p>
                                <p><strong>Tipo:</strong> {referencia.tipo === "S" ? "Síncrono" : "Assíncrono"}</p>
                                <p><strong>Total de Horas:</strong> {referencia.total_horas}</p>
                                <p><strong>Nível:</strong> {referencia.nivel}</p>
                                <p><strong>Certificado:</strong> {referencia.certificado ? "Sim" : "Não"}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Tópico:</strong> {topico?.descricao || "N/A"}</p>
                                {referencia.tipo === "S" && referencia.curso_sincrono && (
                                    <>
                                        <p><strong>Formador:</strong> {formador?.colaborador?.nome || "N/A"}</p>
                                        <p><strong>Vagas:</strong> {referencia.curso_sincrono.limite_vagas}</p>
                                        <p><strong>Data de Início:</strong> {referencia.curso_sincrono.data_inicio ? new Date(referencia.curso_sincrono.data_inicio).toLocaleDateString() : "N/A"}</p>
                                        <p><strong>Data de Fim:</strong> {referencia.curso_sincrono.data_fim ? new Date(referencia.curso_sincrono.data_fim).toLocaleDateString() : "N/A"}</p>
                                    </>
                                )}
                            </Col>
                        </Row>
                        <div className="curso-descricao mt-3">
                            <h5>Descrição</h5>
                            <p>{referencia.descricao}</p>
                        </div>
                    </div>
                )}

                {tipoReferencia === "forum" && referencia && (
                    <div className="forum-info-section mb-4">
                        <h3>Informações do Fórum</h3>
                        <Row>
                            <Col md={6}>
                                <p><strong>Nome do Tópico:</strong> {referencia.nome || referencia.descricao}</p>
                                <p><strong>ID do Tópico:</strong> {referencia.topico_id}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Área:</strong> {referencia.area_id ? `Área ID: ${referencia.area_id}` : "N/A"}</p>
                            </Col>
                        </Row>
                        <div className="forum-descricao mt-3">
                            <h5>Descrição</h5>
                            <p>{referencia.descricao}</p>
                        </div>
                    </div>
                )}

                <div className="form-buttons">
                    <Cancelar text="Voltar" onClick={goBack} Icon={BsArrowReturnLeft} inline={true} />
                    <div>
                        <Button 
                            variant="danger" 
                            className="me-2" 
                            onClick={recusarPedido} 
                            disabled={processando}
                        >
                            {processando ? "Processando..." : "Recusar Pedido"}
                        </Button>
                        <Button 
                            variant="success" 
                            onClick={aprovarPedido} 
                            disabled={processando}
                        >
                            {processando ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span className="ms-2">Processando...</span>
                                </>
                            ) : (
                                <>
                                    <BsCheckCircle className="me-2" />
                                    Aprovar Pedido
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
}