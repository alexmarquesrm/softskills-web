import React, { useState, useEffect } from "react";
import {
    Container, Row, Col, Card, ListGroup, Spinner,
    ProgressBar, Badge, Accordion, Button, Alert
} from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import "./detailsCourseGestor.css";
import {
    BsFillPeopleFill, BsCalendarCheck, BsPlusCircle, BsPencilSquare, BsFileText,
    BsCameraVideo, BsBook, BsTools, BsUpload, BsInfoCircle, BsExclamationTriangle,
    BsCheckCircle, BsQuestionCircle, BsClock, BsFlag, BsDownload, BsPlayFill
} from "react-icons/bs";
import { FiUpload, FiEye, FiDownload } from "react-icons/fi";
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
    const [activeSection, setActiveSection] = useState("sobre");
    const [materials, setMaterials] = useState([]);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [materialLoading, setMaterialLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null);

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

    // Fetch course materials when the active section changes to "materiais"
    useEffect(() => {
        const fetchMaterials = async () => {
            if (!cursoId) return;

            try {
                setMaterialLoading(true);
                const token = sessionStorage.getItem('token');

                const response = await axios.get(`/material/curso/${cursoId}/materiais`, {
                    headers: { Authorization: `${token}` }
                });

                if (response.data.success) {
                    setMaterials(response.data.data);
                } else {
                    console.error("Erro ao carregar materiais:", response.data.message);
                }
            } catch (err) {
                console.error("Erro ao carregar materiais do curso:", err);
            } finally {
                setMaterialLoading(false);
            }
        };

        if (activeSection === "materiais") {
            fetchMaterials();
        }
    }, [cursoId, activeSection, refreshTrigger]);

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleEditFile = (fileId) => {
        setSelectedFileId(fileId);
        setEditFile(true);
    };

    const handleAddContent = () => {
        setAddFile(true);
    };

    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleUpdateSuccess = (updatedMaterial, isDeleted = false) => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Group materials by type
    const getMaterialsByType = (tipo) => {
        return materials.filter(material => material.tipo === tipo);
    };

    const handleFileAction = async (material, action = 'view') => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`/material/${material.id}/download`, {
                headers: { Authorization: `${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const extension = material.nome.split('.').pop().toLowerCase();

            if (action === 'view') {
                if (['mp4', 'webm', 'ogg'].includes(extension)) {
                    setSelectedVideo({ url, title: material.nome });
                } else if (['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                    window.open(url, '_blank');
                } else {
                    // For other file types, force download
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', material.nome);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
            } else if (action === 'download') {
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', material.nome);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            alert('Erro ao processar arquivo. Por favor, tente novamente.');
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Desconhecido';

        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Não especificado";
        return new Date(dateString).toLocaleDateString('pt-PT');
    };

    const getFormadorNome = () => {
        return curso?.curso_sincrono?.sincrono_formador?.formador_colab?.nome || "Não especificado";
    };

    const objetivos = [
        "Compreender os princípios fundamentais da matéria",
        "Aplicar técnicas em situações práticas",
        "Desenvolver habilidades analíticas",
        "Criar soluções para problemas complexos",
        "Avaliar resultados e propor melhorias"
    ];

    if (loading) {
        return (
            <div className="loading-container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">A carregar...</span>
                </Spinner>
                <p className="ms-3 fw-bold">A carregar informação do curso...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
                <BsExclamationTriangle size={48} className="text-danger mb-3" />
                <h3>Ocorreu um erro</h3>
                <p>{error}</p>
                <Button variant="outline-primary">Voltar à página inicial</Button>
            </div>
        );
    }

    return (
        <div className="curso-content" style={{ backgroundColor: "#f5f7fa" }}>
            <Container className="my-5">
                {/* Cabeçalho do Curso com Banner */}
                <Card className="curso-card shadow border-0 overflow-hidden mb-4">
                    <div className="curso-banner bg-primary text-white p-4">
                        <Container>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h1 className="display-6 fw-bold mb-2">{curso?.titulo || "Detalhes do Curso"}</h1>
                                    <div className="curso-meta d-flex align-items-center flex-wrap">
                                        <Badge bg="light" text="primary" className="me-2 mb-2 py-2 px-3">
                                            <BsFillPeopleFill className="me-1" />
                                            {curso?.tipo === "S" ? "Curso Síncrono" : "Curso Assíncrono"}
                                        </Badge>
                                        {curso?.nivel && (
                                            <Badge bg="light" text="primary" className="me-2 mb-2 py-2 px-3">
                                                <BsInfoCircle className="me-1" />
                                                Nível: {curso.nivel}
                                            </Badge>
                                        )}
                                        {curso?.curso_topico?.length > 0 && (
                                            <Badge bg="light" text="primary" className="me-2 mb-2 py-2 px-3">
                                                <BsInfoCircle className="me-1" />
                                                {curso.curso_topico[0].descricao || "Tópico não especificado"}
                                            </Badge>
                                        )}
                                        {curso?.total_horas && (
                                            <Badge bg="light" text="primary" className="me-2 mb-2 py-2 px-3">
                                                <BsClock className="me-1" />
                                                {curso.total_horas} horas
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </Container>
                    </div>

                    {/* Menu de Navegação */}
                    <div className="course-navigation bg-white p-2">
                        <Container>
                            <div className="d-flex flex-wrap">
                                <Button
                                    variant={activeSection === "sobre" ? "primary" : "light"}
                                    onClick={() => handleSectionChange("sobre")}
                                    className="me-2 mb-2"
                                >
                                    <BsInfoCircle className="me-1" /> Sobre
                                </Button>
                                <Button
                                    variant={activeSection === "materiais" ? "primary" : "light"}
                                    onClick={() => handleSectionChange("materiais")}
                                    className="me-2 mb-2"
                                >
                                    <BsBook className="me-1" /> Materiais
                                </Button>
                                <Button
                                    variant={activeSection === "objetivos" ? "primary" : "light"}
                                    onClick={() => handleSectionChange("objetivos")}
                                    className="me-2 mb-2"
                                >
                                    <BsFlag className="me-1" /> Objetivos
                                </Button>
                                {curso?.tipo === "S" && (
                                    <Button
                                        variant={activeSection === "alunos" ? "primary" : "light"}
                                        onClick={() => handleSectionChange("alunos")}
                                        className="me-2 mb-2"
                                    >
                                        <BsFillPeopleFill className="me-1" /> Alunos
                                    </Button>
                                )}
                            </div>
                        </Container>
                    </div>
                </Card>

                {/* Conteúdo da Seção Ativa */}
                <div className="section-content">
                    {/* Seção "Sobre" */}
                    {activeSection === "sobre" && (
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <h4 className="section-subtitle mb-4">
                                    <BsInfoCircle className="me-2 text-primary" />
                                    Informações do Curso
                                </h4>

                                <Row>
                                    <Col lg={8}>
                                        <div className="curso-info mb-4">
                                            <h5 className="mb-3">Descrição</h5>
                                            <p className="text-muted">
                                                {curso?.descricao || "Este curso foi projetado para fornecer uma compreensão abrangente do tema, combinando teoria e prática para desenvolver habilidades aplicáveis em situações reais."}
                                            </p>

                                            {curso?.tipo === "S" && (
                                                <div className="formador-info mt-4">
                                                    <h5 className="mb-3">Formador</h5>
                                                    <div className="d-flex align-items-center">
                                                        <div className="formador-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "60px", height: "60px" }}>
                                                            <BsFillPeopleFill size={24} />
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-1">{getFormadorNome()}</h6>
                                                            <p className="text-muted mb-0">Especialista na área</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Col>

                                    <Col lg={4}>
                                        <Card className="info-card bg-light border-0">
                                            <Card.Body>
                                                <h5 className="mb-3">Detalhes</h5>
                                                <ul className="list-unstyled">
                                                    {curso?.curso_sincrono?.[0]?.data_inicio && (
                                                        <li className="mb-2 d-flex">
                                                            <BsCalendarCheck className="me-2 text-primary mt-1" />
                                                            <div>
                                                                <strong>Início:</strong><br />
                                                                {formatDate(curso.curso_sincrono[0].data_inicio)}
                                                            </div>
                                                        </li>
                                                    )}

                                                    {curso?.curso_sincrono?.[0]?.data_fim && (
                                                        <li className="mb-2 d-flex">
                                                            <BsCalendarCheck className="me-2 text-primary mt-1" />
                                                            <div>
                                                                <strong>Término:</strong><br />
                                                                {formatDate(curso.curso_sincrono[0].data_fim)}
                                                            </div>
                                                        </li>
                                                    )}

                                                    {curso?.curso_sincrono?.[0]?.limite_vagas && (
                                                        <li className="mb-2 d-flex">
                                                            <BsFillPeopleFill className="me-2 text-primary mt-1" />
                                                            <div>
                                                                <strong>Vagas:</strong><br />
                                                                {curso.curso_sincrono[0].limite_vagas}
                                                            </div>
                                                        </li>
                                                    )}

                                                    {curso?.curso_sincrono?.[0]?.estado !== undefined && (
                                                        <li className="mb-2 d-flex">
                                                            <BsCheckCircle className="me-2 text-primary mt-1" />
                                                            <div>
                                                                <strong>Estado:</strong><br />
                                                                <Badge bg={curso.curso_sincrono[0].estado ? 'success' : 'warning'}>
                                                                    {curso.curso_sincrono[0].estado ? 'Concluído' : 'Em curso'}
                                                                </Badge>
                                                            </div>
                                                        </li>
                                                    )}

                                                    {curso?.total_horas && (
                                                        <li className="mb-2 d-flex">
                                                            <BsClock className="me-2 text-primary mt-1" />
                                                            <div>
                                                                <strong>Carga horária:</strong><br />
                                                                {curso.total_horas} horas
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Seção "Materiais" */}
                    {activeSection === "materiais" && (
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="section-subtitle mb-0">
                                        <BsBook className="me-2 text-primary" />
                                        Materiais do Curso
                                    </h4>
                                    <div className="curso-actions d-flex" style={{ gap: "10px" }}>
                                        <AddButton
                                            text="Adicionar Material"
                                            Icon={BsPlusCircle}
                                            onClick={handleAddContent}
                                            inline={true}
                                            className="btn-action"
                                        />
                                        {curso?.tipo === 'A' && (
                                            <AddButton
                                                text="Adicionar Quizz"
                                                Icon={BsPlusCircle}
                                                inline={true}
                                                className="btn-action"
                                            />
                                        )}
                                    </div>
                                </div>

                                {materialLoading ? (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" role="status" variant="primary">
                                            <span className="visually-hidden">A carregar materiais...</span>
                                        </Spinner>
                                        <p className="mt-2">A carregar os materiais do curso...</p>
                                    </div>
                                ) : materials.length === 0 ? (
                                    <Alert variant="light" className="text-center">
                                        <BsInfoCircle className="me-2" />
                                        Nenhum material foi adicionado a este curso ainda.
                                        <div className="mt-3">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={handleAddContent}
                                                className="d-inline-flex align-items-center"
                                            >
                                                <BsPlusCircle className="me-2" />
                                                Adicionar Primeiro Material
                                            </Button>
                                        </div>
                                    </Alert>
                                ) : (
                                    <Accordion defaultActiveKey={[]} alwaysOpen className="material-accordion">
                                        {/* Vídeos */}
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                <div className="d-flex align-items-center">
                                                    <BsCameraVideo className="me-2 text-danger" />
                                                    <span>Vídeos</span>
                                                    <Badge bg="danger" className="ms-2">
                                                        {getMaterialsByType('video').length}
                                                    </Badge>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {getMaterialsByType('video').length === 0 ? (
                                                    <p className="text-muted text-center py-3">Nenhum vídeo adicionado</p>
                                                ) : (
                                                    <ListGroup variant="flush" className="material-list">
                                                        {getMaterialsByType('video').map((material) => (
                                                            <ListGroup.Item key={material.id} className="material-item py-3">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="d-flex align-items-start">
                                                                        <div className="me-3 text-danger">
                                                                            <BsPlayFill size={24} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="fw-bold">{material.titulo}</div>
                                                                            {material.descricao && (
                                                                                <small className="text-muted d-block mb-2">{material.descricao}</small>
                                                                            )}
                                                                            <div>
                                                                                {material.ficheiros.map((file, idx) => (
                                                                                    <Badge
                                                                                        key={idx}
                                                                                        bg="light"
                                                                                        text="danger"
                                                                                        onClick={() => handleFileAction(material, 'view')}
                                                                                        style={{ cursor: 'pointer' }}
                                                                                        className="me-2 mb-1 text-decoration-none d-inline-flex align-items-center"
                                                                                    >
                                                                                        <BsDownload className="me-1" /> {file.nome.split('.').pop().toUpperCase()} • {file.nome}
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <EditButton
                                                                        text=""
                                                                        Icon={BsPencilSquare}
                                                                        onClick={() => handleEditFile(material.id)}
                                                                        inline={true}
                                                                        className="btn-edit-small"
                                                                    />
                                                                </div>
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>

                                        {/* Documentos e Aulas */}
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>
                                                <div className="d-flex align-items-center">
                                                    <BsFileText className="me-2 text-primary" />
                                                    <span>Documentos e Aulas</span>
                                                    <Badge bg="primary" className="ms-2">
                                                        {getMaterialsByType('documento').length + getMaterialsByType('aula').length}
                                                    </Badge>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {getMaterialsByType('documento').length === 0 && getMaterialsByType('aula').length === 0 ? (
                                                    <p className="text-muted text-center py-3">Nenhum documento ou aula adicionado</p>
                                                ) : (
                                                    <ListGroup variant="flush" className="material-list">
                                                        {[...getMaterialsByType('documento'), ...getMaterialsByType('aula')].map((material) => (
                                                            <ListGroup.Item key={material.id} className="material-item py-3">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="d-flex align-items-start">
                                                                        <div className="me-3 text-primary">
                                                                            {material.tipo === 'aula' ? <BsBook size={24} /> : <BsFileText size={24} />}
                                                                        </div>
                                                                        <div>
                                                                            <div className="fw-bold">{material.titulo}</div>
                                                                            {material.descricao && (
                                                                                <small className="text-muted d-block mb-2">{material.descricao}</small>
                                                                            )}
                                                                            <div>
                                                                                {material.ficheiros.map((file, idx) => (
                                                                                    <Badge
                                                                                        key={idx}
                                                                                        bg="light"
                                                                                        text="primary"
                                                                                        onClick={() => handleFileAction(material, 'view')}
                                                                                        style={{ cursor: 'pointer' }}
                                                                                        className="me-2 mb-1 text-decoration-none d-inline-flex align-items-center"
                                                                                    >
                                                                                        <BsDownload className="me-1" /> {file.nome.split('.').pop().toUpperCase()} • {file.nome}
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <EditButton
                                                                        text=""
                                                                        Icon={BsPencilSquare}
                                                                        onClick={() => handleEditFile(material.id)}
                                                                        inline={true}
                                                                        className="btn-edit-small"
                                                                    />
                                                                </div>
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>

                                        {/* Entregas e Avaliações */}
                                        <Accordion.Item eventKey="2">
                                            <Accordion.Header>
                                                <div className="d-flex align-items-center">
                                                    <BsUpload className="me-2 text-warning" />
                                                    <span>Entregas e Avaliações</span>
                                                    <Badge bg="warning" className="ms-2">
                                                        {getMaterialsByType('entrega').length + getMaterialsByType('trabalho').length}
                                                    </Badge>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {getMaterialsByType('entrega').length === 0 && getMaterialsByType('trabalho').length === 0 ? (
                                                    <p className="text-muted text-center py-3">Nenhuma entrega ou trabalho adicionado</p>
                                                ) : (
                                                    <ListGroup variant="flush" className="material-list">
                                                        {[...getMaterialsByType('entrega'), ...getMaterialsByType('trabalho')].map((material) => (
                                                            <ListGroup.Item key={material.id} className="material-item py-3">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="d-flex align-items-start">
                                                                        <div className="me-3 text-warning">
                                                                            <BsUpload size={24} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="fw-bold">{material.titulo}</div>
                                                                            {material.descricao && (
                                                                                <small className="text-muted d-block mb-2">{material.descricao}</small>
                                                                            )}
                                                                            {material.data_entrega && (
                                                                                <Badge bg="warning" text="dark" className="mb-2">
                                                                                    <BsClock className="me-1" /> Prazo: {formatDate(material.data_entrega)}
                                                                                </Badge>
                                                                            )}
                                                                            <div>
                                                                                {material.ficheiros.map((file, idx) => (
                                                                                    <Badge
                                                                                        key={idx}
                                                                                        bg="light"
                                                                                        text="warning"
                                                                                        onClick={() => handleFileAction(material, 'view')}
                                                                                        style={{ cursor: 'pointer' }}
                                                                                        className="me-2 mb-1 text-decoration-none d-inline-flex align-items-center"
                                                                                    >
                                                                                        <BsDownload className="me-1" /> {file.nome.split('.').pop().toUpperCase()} • {file.nome}
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <EditButton
                                                                        text=""
                                                                        Icon={BsPencilSquare}
                                                                        onClick={() => handleEditFile(material.id)}
                                                                        inline={true}
                                                                        className="btn-edit-small"
                                                                    />
                                                                </div>
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                )}
                            </Card.Body>
                        </Card>
                    )}

                    {/* Seção "Objetivos" */}
                    {activeSection === "objetivos" && (
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="section-subtitle mb-0">
                                        <BsFlag className="me-2 text-primary" />
                                        Objetivos de Aprendizagem
                                    </h4>

                                </div>

                                <Row>
                                    <Col md={12}>
                                        <div className="objectives-container p-4 bg-light rounded">
                                            <h5 className="mb-3">Ao concluir este curso, o aluno será capaz de:</h5>
                                            <ListGroup variant="flush">
                                                {objetivos.map((objetivo, idx) => (
                                                    <ListGroup.Item key={idx} className="bg-transparent border-0 py-2">
                                                        <div className="d-flex">
                                                            <div className="objective-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ minWidth: "30px", height: "30px" }}>
                                                                {idx + 1}
                                                            </div>
                                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                                <div>{objetivo}</div>

                                                            </div>
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Seção "Alunos" (apenas para cursos síncronos) */}
                    {activeSection === "alunos" && curso?.tipo === "S" && (
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <h4 className="section-subtitle mb-4">
                                    <BsFillPeopleFill className="me-2 text-primary" />
                                    Alunos Inscritos
                                </h4>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <Badge bg="primary" className="me-2 py-2 px-3">
                                            Total: {curso?.curso_sincrono?.[0]?.limite_vagas || 0} Vagas
                                        </Badge>
                                        <Badge bg="success" className="me-2 py-2 px-3">
                                            Inscritos: 12 Alunos
                                        </Badge>
                                    </div>
                                    <Button variant="outline-primary">
                                        Exportar Lista
                                    </Button>
                                </div>

                                <ListGroup variant="flush" className="material-list">
                                    {[...Array(5)].map((_, idx) => (
                                        <ListGroup.Item key={idx} className="material-item py-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <div className="formador-avatar bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
                                                        <BsFillPeopleFill size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">Aluno {idx + 1}</div>
                                                        <small className="text-muted">aluno{idx + 1}@email.com</small>
                                                    </div>
                                                </div>
                                                <Badge bg="success">Inscrito</Badge>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </Container>

            <ModalAdicionarFicheiro
                show={addFile}
                handleClose={() => setAddFile(false)}
                tiposPermitidos={curso?.tipo === 'S' ? ['documento', 'video', 'entrega', 'trabalho', 'aula'] : ['documento', 'video']}
                courseId={cursoId}
                onUploadSuccess={handleUploadSuccess}
            />

            <ModalEditarFicheiro
                show={editFile}
                handleClose={() => {
                    setEditFile(false);
                    setSelectedFileId(null);
                }}
                fileId={selectedFileId}
                cursoId={cursoId}
                onUpdateSuccess={handleUpdateSuccess}
            />
        </div>
    );
}