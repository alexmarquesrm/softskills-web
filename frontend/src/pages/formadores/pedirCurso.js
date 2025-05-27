import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Book } from 'react-feather';
import { BsArrowReturnLeft } from "react-icons/bs";

import axios from "../../config/configAxios";
import "../gestor/addCourse.css";
import Cancelar from "../../components/buttons/cancelButton";

export default function PedirCurso() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [formadores, setFormadores] = useState([]);

    const [filteredAreas, setFilteredAreas] = useState([]);
    const [filteredTopicos, setFilteredTopicos] = useState([]);

    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        tipo: "",
        horas: "",
        categoria_id: "",
        area_id: "",
        topico_id: "",
        formador_id: "",
        vagas: "",
        grau_dificuldade: "",
        data_limite_inscricao: "",
        data_inicio: "",
        data_fim: "",
        certificado: ""
    });

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const token = sessionStorage.getItem('token');

                const [cat, area, top, form] = await Promise.all([
                    axios.get('/categoria', { headers: { Authorization: `${token}` } }),
                    axios.get('/area', { headers: { Authorization: `${token}` } }),
                    axios.get('/topico', { headers: { Authorization: `${token}` } }),
                    axios.get('/formador', { headers: { Authorization: `${token}` } })
                ]);

                setCategorias(cat.data);
                setAreas(area.data);
                setTopicos(top.data);
                setFormadores(form.data);
            } catch (error) {
                console.error("Erro ao procurar dados para os dropdowns", error);
                setError("Falha ao carregar os dados necessários. Por favor, tente novamente.");
            }
        };

        fetchDropdownData();
    }, []);

    useEffect(() => {
        if (formData.categoria_id) {
            const filtered = areas.filter(area => area.categoria_id === parseInt(formData.categoria_id));
            setFilteredAreas(filtered);
        } else {
            setFilteredAreas([]);
        }
        setFormData(prev => ({ ...prev, area_id: "", topico_id: "" }));
    }, [formData.categoria_id, areas]);

    useEffect(() => {
        if (formData.area_id) {
            const filtered = topicos.filter(topico => topico.area_id === parseInt(formData.area_id));
            setFilteredTopicos(filtered);
        } else {
            setFilteredTopicos([]);
        }
        setFormData(prev => ({ ...prev, topico_id: "" }));
    }, [formData.area_id, topicos]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.tipo === 'S') {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const inscricao = new Date(formData.data_limite_inscricao);
            const inicio = new Date(formData.data_inicio);
            const fim = new Date(formData.data_fim);

            if (inscricao < hoje) {
                setError("A data limite de inscrição não pode ser anterior à data atual.");
                setLoading(false);
                return;
            }

            if (inscricao >= inicio) {
                setError("A data de início do curso deve ser posterior à data limite de inscrição.");
                setLoading(false);
                return;
            }

            if (inicio >= fim) {
                setError("A data de fim do curso deve ser posterior à data de início.");
                setLoading(false);
                return;
            }
        }

        try {
            const token = sessionStorage.getItem('token');
            const colaboradorId = sessionStorage.getItem('colaboradorid');

            // criar o pedido
            let pedidoData = {
                colaborador_id: parseInt(colaboradorId),
                tipo: 'CURSO',
                referencia_id: null,
                data: new Date().toISOString()
            };


            let cursoData = {
                gestor_id: 1,
                topico_id: parseInt(formData.topico_id),
                tipo: formData.tipo,
                total_horas: parseInt(formData.horas),
                titulo: formData.titulo,
                descricao: formData.descricao,
                pendente: true,
                aprovado: false,
                certificado: formData.certificado,
                nivel: formData.grau_dificuldade
            };


            if (formData.tipo === 'S') {
                cursoData.sincrono = {
                    formador_id: formData.formador_id,
                    limite_vagas: formData.vagas,
                    data_limite_inscricao: formData.data_limite_inscricao,
                    data_inicio: formData.data_inicio,
                    data_fim: formData.data_fim,
                    estado: false
                };
            }


            const cursoResponse = await axios.post('/curso/criar', cursoData, {
                headers: { Authorization: `${token}` }
            });
            if (cursoResponse.data && cursoResponse.data.curso.curso_id) {
                pedidoData.referencia_id = cursoResponse.data.curso.curso_id;

                // Criar o pedido na tabela pedidos
                await axios.post('/pedido/criar', pedidoData, {
                    headers: { Authorization: `${token}` }
                });
                setSuccess(true);
                setTimeout(() => {
                    navigate('/formador/cursos');
                }, 2000);
            }

        } catch (error) {
            console.error("Erro ao criar pedido de curso", error);
            setError("Não foi possível criar o pedido de curso. Por favor, verifique os dados e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="add-course-page">
            <Container>
                <div className="page-header">
                    <div className="header-left">
                        <div className="title-container">
                            <Book size={28} className="title-icon" />
                            <h1>Solicitar Novo Curso</h1>
                        </div>
                    </div>
                </div>

                {success && <Alert variant="success">Pedido de curso enviado com sucesso! Redirecionando...</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="course-form">
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome do Curso</Form.Label>
                                <Form.Control type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Curso</Form.Label>
                                <Form.Select name="tipo" value={formData.tipo} onChange={handleChange} required>
                                    <option value="">Selecione o tipo de curso</option>
                                    <option value="S">Síncrono</option>
                                    <option value="A">Assíncrono</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Número de Horas</Form.Label>
                                <Form.Control type="number" name="horas" value={formData.horas} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Categoria</Form.Label>
                                <Form.Select name="categoria_id" value={formData.categoria_id} onChange={handleChange} required>
                                    <option value="">Selecione uma categoria</option>
                                    {categorias.map(categoria => (
                                        <option key={categoria.categoria_id} value={categoria.categoria_id}>
                                            {categoria.descricao || `Categoria ${categoria.categoria_id}`}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Área</Form.Label>
                                <Form.Select name="area_id" value={formData.area_id} onChange={handleChange} required>
                                    <option value="">Selecione uma área</option>
                                    {filteredAreas.map(area => (
                                        <option key={area.area_id} value={area.area_id}>
                                            {area.nome || area.descricao || `Área ${area.area_id}`}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tópico</Form.Label>
                                <Form.Select name="topico_id" value={formData.topico_id} onChange={handleChange} required>
                                    <option value="">Selecione um tópico</option>
                                    {filteredTopicos.map(topico => (
                                        <option key={topico.topico_id} value={topico.topico_id}>
                                            {topico.nome || topico.descricao || `Tópico ${topico.topico_id}`}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Grau de Dificuldade</Form.Label>
                                <Form.Select name="grau_dificuldade" value={formData.grau_dificuldade} onChange={handleChange} required>
                                    <option value="">Selecione o grau de dificuldade</option>
                                    <option value="1">Nível: 1 (Iniciante)</option>
                                    <option value="2">Nível: 2 (Intermédio)</option>
                                    <option value="3">Nível: 3 (Avançado)</option>
                                    <option value="4">Nível: 4 (Expert)</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>


                        {formData.tipo === 'S' && (
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Formador</Form.Label>
                                    <Form.Select name="formador_id" value={formData.formador_id} onChange={handleChange} required>
                                        <option value="">Selecione um formador</option>
                                        {formadores.map(formador => (
                                            <option key={formador.id} value={formador.id}>
                                                {formador.colaborador?.nome || `Formador ${formador.id}`}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        )}
                    </Row>

                    {formData.tipo === 'S' && (
                        <>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Número de Vagas</Form.Label>
                                        <Form.Control type="number" name="vagas" value={formData.vagas} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data Limite de Inscrição</Form.Label>
                                        <Form.Control type="date" name="data_limite_inscricao" value={formData.data_limite_inscricao} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data de Início</Form.Label>
                                        <Form.Control type="date" name="data_inicio" value={formData.data_inicio} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data de Fim</Form.Label>
                                        <Form.Control type="date" name="data_fim" value={formData.data_fim} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>

                        </>
                    )}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Certificado</Form.Label>
                                <Form.Select name="certificado" value={formData.certificado} onChange={handleChange} required>
                                    <option value="">Selecione uma opção</option>
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control as="textarea" rows={5} name="descricao" value={formData.descricao} onChange={handleChange} required />
                    </Form.Group>

                    <div className="form-buttons">
                        <Cancelar text="Cancelar" onClick={goBack} Icon={BsArrowReturnLeft} inline={true} />
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span className="ms-2">A enviar...</span>
                                </>
                            ) : (
                                "Enviar Pedido"
                            )}
                        </Button>

                    </div>
                </Form>
            </Container>
        </div>
    );
}