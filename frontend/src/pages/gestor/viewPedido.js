import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { File, Calendar, User, Book, Clock, Award, Info, Mail } from 'react-feather'; 
import { BsArrowReturnLeft, BsCheckCircle, BsXCircle } from "react-icons/bs";
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
    const [referencia, setReferencia] = useState(null);
    const [tipoReferencia, setTipoReferencia] = useState("");
    const [topico, setTopico] = useState(null);
    const [formador, setFormador] = useState(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                setLoading(true);
                const token = sessionStorage.getItem('token');
                
                const pedidoRes = await axios.get(`/pedido/${id}`, {
                    headers: { Authorization: `${token}` }
                });
                setPedido(pedidoRes.data);
                const colaboradorRes = await axios.get(`/colaborador/${pedidoRes.data.colaborador_id}`, {
                    headers: { Authorization: `${token}` }
                });
                setColaborador(colaboradorRes.data);
                
                if (pedidoRes.data.tipo === "CURSO") {
                    setTipoReferencia("curso");
                    const cursoRes = await axios.get(`/curso/${pedidoRes.data.referencia_id}`, {
                        headers: { Authorization: `${token}` }
                    });
                    setReferencia(cursoRes.data);
                    
                    if (cursoRes.data.tipo === "S" && cursoRes.data.curso_sincrono?.formador_id) {
                        const formadorRes = await axios.get(`/formador/${cursoRes.data.curso_sincrono.formador_id}`, {
                            headers: { Authorization: `${token}` }
                        });
                        setFormador(formadorRes.data);
                    }
                    
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
                status: 'APROVADO',
                aprovado: true    
            }, {
                headers: { Authorization: `${token}` }
            });

            setSuccess(true);
            setTimeout(() => navigate('/gestor/lista/pedidos'), 2000);
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
                pendente: false,
                status: 'RECUSADO',
                aprovado: false    
            }, {
                headers: { Authorization: `${token}` }
            });

            setSuccess(true);
            setTimeout(() => navigate('/gestor/lista/pedidos'), 2000);
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

    console.log(pedido);
    const getStatusBadge = (pedido) => {
        if (pedido?.ped_curso?.pendente === true && pedido?.ped_curso?.aprovado === false) {
            return <span className="badge bg-warning">Pendente</span>;
        } else if (pedido?.ped_curso?.pendente === false && pedido?.ped_curso?.aprovado === true) {
            return <span className="badge bg-success">Aprovado</span>;
        } else if (pedido?.ped_curso?.pendente === false && pedido?.ped_curso?.aprovado === false) {
            return <span className="badge bg-danger">Recusado</span>;
        }
    };

    return (
        <div className="view-pedido-page">
            <Container>
                <div className="page-header">
                    <div className="title-container">
                        <div className="title-icon">
                            <File size={24} />
                        </div>
                        <h1>Detalhes do Pedido</h1>
                    </div>
                </div>

                {success && (
                    <Alert variant="success">
                        <BsCheckCircle className="me-2" />
                        Pedido processado com sucesso! Redirecionando...
                    </Alert>
                )}
                {error && (
                    <Alert variant="danger">
                        <BsXCircle className="me-2" />
                        {error}
                    </Alert>
                )}

                <Card>
                    <Card.Header>
                        <h3>Informações do Pedido</h3>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <div className="info-item">
                                    <User size={24} />
                                    <div>
                                        <strong>Solicitante:</strong>
                                        <p className="mb-0">{colaborador?.nome || `Colaborador ID: ${pedido?.colaborador_id}`}</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <Mail size={24} />
                                    <div>
                                        <strong>Email:</strong>
                                        <p className="mb-0">{colaborador?.email || "N/A"}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="info-item">
                                    <Calendar size={24} />
                                    <div>
                                        <strong>Data do Pedido:</strong>
                                        <p className="mb-0">{new Date(pedido?.data).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <Info size={24} />
                                    <div>
                                        <strong>Estado:</strong>
                                        <p className="mb-0">{getStatusBadge(pedido)}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {tipoReferencia === "curso" && referencia && (
                    <Card>
                        <Card.Header>
                            <h3>Informações do Curso</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <div className="info-item">
                                        <Book size={24} />
                                        <div>
                                            <strong>Título:</strong>
                                            <p className="mb-0">{referencia.titulo}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <Clock size={24} />
                                        <div>
                                            <strong>Total de Horas:</strong>
                                            <p className="mb-0">{referencia.total_horas}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <Award size={24} />
                                        <div>
                                            <strong>Nível:</strong>
                                            <p className="mb-0">{referencia.nivel}</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="info-item">
                                        <Info size={24} />
                                        <div>
                                            <strong>Tópico:</strong>
                                            <p className="mb-0">{topico?.descricao || "N/A"}</p>
                                        </div>
                                    </div>
                                    {referencia.tipo === "S" && referencia.curso_sincrono && (
                                        <>
                                            <div className="info-item">
                                                <User size={24} />
                                                <div>
                                                    <strong>Formador:</strong>
                                                    <p className="mb-0">{formador?.colaborador?.nome || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <Calendar size={24} />
                                                <div>
                                                    <strong>Data de Início:</strong>
                                                    <p className="mb-0">{referencia.curso_sincrono.data_inicio ? new Date(referencia.curso_sincrono.data_inicio).toLocaleDateString() : "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <Calendar size={24} />
                                                <div>
                                                    <strong>Data de Fim:</strong>
                                                    <p className="mb-0">{referencia.curso_sincrono.data_fim ? new Date(referencia.curso_sincrono.data_fim).toLocaleDateString() : "N/A"}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Col>
                            </Row>
                            <div className="curso-descricao">
                                <h5>Descrição</h5>
                                <p className="mb-0">{referencia.descricao}</p>
                            </div>
                        </Card.Body>
                    </Card>
                )}

                {tipoReferencia === "forum" && referencia && (
                    <Card>
                        <Card.Header>
                            <h3>Informações do Fórum</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <div className="info-item">
                                        <Book size={24} />
                                        <div>
                                            <strong>Nome do Tópico:</strong>
                                            <p className="mb-0">{referencia.nome || referencia.descricao}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <Info size={24} />
                                        <div>
                                            <strong>ID do Tópico:</strong>
                                            <p className="mb-0">{referencia.topico_id}</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="info-item">
                                        <Info size={24} />
                                        <div>
                                            <strong>Área:</strong>
                                            <p className="mb-0">{referencia.area_id ? `Área ID: ${referencia.area_id}` : "N/A"}</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="forum-descricao">
                                <h5>Descrição</h5>
                                <p className="mb-0">{referencia.descricao}</p>
                            </div>
                        </Card.Body>
                    </Card>
                )}

                <div className="form-buttons">
                    <Cancelar text="Voltar" onClick={goBack} Icon={BsArrowReturnLeft} inline={true} />
                    <div>
                        <Button 
                            variant="danger" 
                            className="me-2" 
                            onClick={recusarPedido} 
                            disabled={processando || pedido?.pendente === false}
                        >
                            {processando ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span className="ms-2">Processando...</span>
                                </>
                            ) : (
                                <>
                                    <BsXCircle className="me-2" />
                                    Recusar Pedido
                                </>
                            )}
                        </Button>
                        <Button 
                            variant="success" 
                            onClick={aprovarPedido} 
                            disabled={processando || pedido?.pendente === false}
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