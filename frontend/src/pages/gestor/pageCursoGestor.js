import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Spinner } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import "./detailsCourseGestor.css";
import {
    BsFillPeopleFill, BsCalendarCheck, BsPlusCircle, BsPencilSquare, BsFileText,
    BsCameraVideo, BsBook, BsTools, BsUpload, BsInfoCircle, BsExclamationTriangle
} from "react-icons/bs";
import axios from "../../config/configAxios";

/* COMPONENTES */
import AddButton from "../../components/buttons/addButton";
import EditButton from "../../components/buttons/editButton";
/* MODALS */
import ModalAdicionarFicheiro from "../../modals/addFile";
import ModalEditarFicheiro from "../../modals/edditFile";

export default function CursoDetalhesGestor() {
    const { id } = useParams();
    const location = useLocation();
    const cursoId = location.state?.id || id;

    const [addFile, setAddFile] = useState(false);
    const [editFile, setEditFile] = useState(false);
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCursoData = async () => {
            if (!cursoId) {
                setError("ID do curso não encontrado");
                setLoading(false);
                return;
            }

            try {
                const token = sessionStorage.getItem('token');

                const response = await axios.get(`/curso/${cursoId}`, {
                    headers: { Authorization: `${token}` }
                });

                const foundCourse = response.data;
                if (foundCourse) {
                    setCurso(foundCourse);
                    console.log("Dados do curso carregados (Gestor):", foundCourse);
                } else {
                    setError("Curso não encontrado");
                }

                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar dados do curso:", err);
                setError("Não foi possível carregar os dados do curso");
                setLoading(false);
            }
        };

        fetchCursoData();
    }, [cursoId]);

    const getFormadorNome = () => {
        return curso?.curso_sincrono?.sincrono_formador?.formador_colab?.nome || "Não especificado";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Não especificado";
        return new Date(dateString).toLocaleDateString('pt-PT');
    };

    const materiaisSincronos = [
        { label: "Apresentação do curso", icon: <BsFileText className="me-2" />, type: "documento" },
        { label: "Vídeo 1", icon: <BsCameraVideo className="me-2" />, type: "video" },
        { label: "Vídeo 2", icon: <BsCameraVideo className="me-2" />, type: "video" },
        { label: "Aula Teórica 1", icon: <BsBook className="me-2" />, type: "aula" },
        { label: "Aula Teórica 2", icon: <BsBook className="me-2" />, type: "aula" },
        { label: "Aula Teórica 3", icon: <BsBook className="me-2" />, type: "aula" },
        { label: "Trabalho Prático 1", icon: <BsTools className="me-2" />, type: "trabalho" },
        { label: "Entrega Trabalho Prático 1", icon: <BsUpload className="me-2" />, type: "entrega" },
    ];

    const materiaisAssincronos = [
        { label: "Apresentação do curso", icon: <BsFileText className="me-2" />, type: "documento" },
        { label: "Vídeo 1", icon: <BsCameraVideo className="me-2" />, type: "video" },
        { label: "Vídeo 2", icon: <BsCameraVideo className="me-2" />, type: "video" },
        { label: "Aula Teórica 1", icon: <BsBook className="me-2" />, type: "aula" },
        { label: "Aula Teórica 2", icon: <BsBook className="me-2" />, type: "aula" },
        { label: "Quiz", icon: <BsTools className="me-2" />, type: "trabalho" },
    ];

    const items = curso?.tipo === "S" ? materiaisSincronos : materiaisAssincronos;

    if (loading) {
        return (
            <div className="loading-container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">A carregar...</span>
                </Spinner>
                <p className="ms-3">A carregar informação do curso...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
                <BsExclamationTriangle size={48} className="text-danger mb-3" />
                <h3>Ocorreu um erro</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="curso-content" style={{ backgroundColor: "#f8f9fa" }}>
            <Container className="my-5">
                <Card className="curso-card shadow-sm">
                    <Card.Header className="curso-header">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="section-title mb-3">{curso?.titulo || "Detalhes do Curso"}</h2>
                                <div className="curso-meta d-flex align-items-center">
                                    <span className="badge bg-primary me-3">
                                        <BsFillPeopleFill className="me-2" />
                                        {curso?.tipo === 'S' ? 'Síncrono' : 'Assíncrono'}
                                    </span>
                                    {curso?.nivel && (
                                        <span className="badge bg-info me-3">
                                            <BsInfoCircle className="me-2" />
                                            Nível: {curso.nivel}
                                        </span>
                                    )}
                                    {curso?.curso_topico?.[0]?.descricao && (
                                        <span className="text-muted">
                                            <BsInfoCircle className="me-2" />
                                            {curso.curso_topico[0].descricao}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="curso-actions d-flex" style={{ gap: "10px" }}>
                                <AddButton text="Adicionar Material" Icon={BsPlusCircle} onClick={() => setAddFile(true)} inline={true} className="btn-gradient" />
                                {curso?.tipo === 'A' && (
                                    <AddButton text="Adicionar Quizz" Icon={BsPlusCircle} inline={true} className="btn-gradient" />
                                )}
                            </div>
                        </div>
                    </Card.Header>

                    <Card.Body>
                        <Row className="mb-4">
                            <Col md={12}>
                                <div className="attendance-section">
                                    <h4 className="section-subtitle">
                                        <BsCalendarCheck className="me-2" />
                                        Sobre
                                    </h4>
                                    <Card className="info-card">
                                        <Card.Body>
                                            {curso?.tipo === 'S' && (
                                                <div>
                                                    <span style={{ fontWeight: "bold" }}>Professor: </span>
                                                    {getFormadorNome()}
                                                </div>
                                            )}
                                            <div>
                                                <span style={{ fontWeight: "450" }}>Descrição: </span>
                                                {curso?.descricao || "Sem descrição disponível"}
                                            </div>
                                            {curso?.total_horas && (
                                                <div>
                                                    <span style={{ fontWeight: "450" }}>Duração: </span>
                                                    {curso.total_horas} horas
                                                </div>
                                            )}
                                            {curso?.curso_sincrono?.[0]?.data_inicio && (
                                                <div>
                                                    <span style={{ fontWeight: "450" }}>Data de Início: </span>
                                                    {formatDate(curso.curso_sincrono[0].data_inicio)}
                                                </div>
                                            )}
                                            {curso?.curso_sincrono?.[0]?.data_fim && (
                                                <div>
                                                    <span style={{ fontWeight: "450" }}>Data de Fim: </span>
                                                    {formatDate(curso.curso_sincrono[0].data_fim)}
                                                </div>
                                            )}
                                            {curso?.curso_sincrono?.[0]?.limite_vagas && (
                                                <div>
                                                    <span style={{ fontWeight: "450" }}>Vagas: </span>
                                                    {curso.curso_sincrono[0].limite_vagas}
                                                </div>
                                            )}
                                            {curso?.curso_sincrono?.[0]?.estado !== undefined && (
                                                <div>
                                                    <span style={{ fontWeight: "450" }}>Estado: </span>
                                                    {curso.curso_sincrono[0].estado ? 'Concluído' : 'Em curso'}
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        </Row>

                        <Row className="align-items-center mb-3">
                            <Col>
                                <h4 className="section-subtitle">Materiais do Curso</h4>
                            </Col>
                        </Row>

                        <ListGroup variant="flush" className="curso-materials">
                            {items.map((item, idx) => (
                                <ListGroup.Item
                                    key={idx}
                                    className={`material-item d-flex justify-content-between align-items-center material-${item.type}`}
                                >
                                    <span className="d-flex align-items-center">
                                        {item.icon}
                                        {item.label}
                                    </span>
                                    <EditButton
                                        text=""
                                        Icon={BsPencilSquare}
                                        onClick={() => setEditFile(true)}
                                        inline={true}
                                        className="btn-edit-small"
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Container>

            <ModalAdicionarFicheiro show={addFile} handleClose={() => setAddFile(false)}tiposPermitidos={curso?.tipo === 'S' ? ['documento', 'video', 'entrega'] : ['documento', 'video']}  courseId={cursoId} allowDueDate={curso?.tipo !== 'A'} />
            <ModalEditarFicheiro show={editFile} handleClose={() => setEditFile(false)} allowDueDate={curso?.tipo !== 'A'} />
        </div>
    );
}
