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
  BsCheckCircle, BsQuestionCircle, BsClock, BsFlag, BsDownload
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
    const [activeSection, setActiveSection] = useState("sobre");
    const [editItemId, setEditItemId] = useState(null);

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
        { id: 1, label: "Apresentação do curso", icon: <BsFileText className="me-2" />, type: "documento", downloadable: true },
        { id: 2, label: "Vídeo 1: Introdução", icon: <BsCameraVideo className="me-2" />, type: "video", duration: "15 min" },
        { id: 3, label: "Vídeo 2: Conceitos Básicos", icon: <BsCameraVideo className="me-2" />, type: "video", duration: "22 min" },
        { id: 4, label: "Aula Teórica 1: Fundamentos", icon: <BsBook className="me-2" />, type: "aula", downloadable: true },
        { id: 5, label: "Aula Teórica 2: Metodologia", icon: <BsBook className="me-2" />, type: "aula", downloadable: true },
        { id: 6, label: "Trabalho Prático 1", icon: <BsTools className="me-2" />, type: "trabalho" },
        { id: 7, label: "Entrega Trabalho Prático 1", icon: <BsUpload className="me-2" />, type: "entrega", deadline: "15/05/2025" },
    ];

    const materiaisAssincronos = [
        { id: 1, label: "Apresentação do curso", icon: <BsFileText className="me-2" />, type: "documento", downloadable: true },
        { id: 2, label: "Vídeo 1: Introdução", icon: <BsCameraVideo className="me-2" />, type: "video", duration: "15 min" },
        { id: 3, label: "Vídeo 2: Conceitos Básicos", icon: <BsCameraVideo className="me-2" />, type: "video", duration: "22 min" },
        { id: 4, label: "Aula Teórica 1: Fundamentos", icon: <BsBook className="me-2" />, type: "aula", downloadable: true },
        { id: 5, label: "Quiz", icon: <BsTools className="me-2" />, type: "quiz" },
    ];

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleEditItem = (itemId) => {
        setEditItemId(itemId);
        setEditFile(true);
    };

    const handleAddContent = () => {
        setAddFile(true);
    };

    const objetivos = [
        "Compreender os princípios fundamentais da matéria",
        "Aplicar técnicas em situações práticas",
        "Desenvolver habilidades analíticas",
        "Criar soluções para problemas complexos",
        "Avaliar resultados e propor melhorias"
    ];

    const items = curso?.tipo === "S" ? materiaisSincronos : materiaisAssincronos;

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
                                                                <strong>Início:</strong><br/>
                                                                {formatDate(curso.curso_sincrono[0].data_inicio)}
                                                            </div>
                                                        </li>
                                                    )}
                                                    
                                                    {curso?.curso_sincrono?.[0]?.data_fim && (
                                                        <li className="mb-2 d-flex">
                                                            <BsCalendarCheck className="me-2 text-primary mt-1" />
                                                            <div>
                                                                <strong>Término:</strong><br/>
                                                                {formatDate(curso.curso_sincrono[0].data_fim)}
                                                            </div>
                                                        </li>
                                                    )}
                                                    
                                                    {curso?.curso_sincrono?.[0]?.limite_vagas && (
                                                        <li className="mb-2 d-flex">
                                                            <BsFillPeopleFill className="me-2 text-primary mt-1" />
                                                            <div>
                                                                <strong>Vagas:</strong><br/>
                                                                {curso.curso_sincrono[0].limite_vagas}
                                                            </div>
                                                        </li>
                                                    )}
                                                    
                                                    {curso?.curso_sincrono?.[0]?.estado !== undefined && (
                                                        <li className="mb-2 d-flex">
                                                            <BsCheckCircle className="me-2 text-primary mt-1" />
                                                            <div>
                                                                <strong>Estado:</strong><br/>
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
                                                                <strong>Carga horária:</strong><br/>
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
                                
                                {/* Organização por tipo */}
                                <Accordion defaultActiveKey="0" className="material-accordion">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            <div className="d-flex align-items-center">
                                                <BsCameraVideo className="me-2 text-primary" />
                                                <span>Vídeos</span>
                                                <Badge bg="primary" className="ms-2">{items.filter(i => i.type === "video").length}</Badge>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup variant="flush" className="material-list">
                                                {items
                                                    .filter(item => item.type === "video")
                                                    .map((item) => (
                                                        <ListGroup.Item key={item.id} className="material-item py-3">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    {item.icon}
                                                                    <div>
                                                                        <div className="fw-bold">{item.label}</div>
                                                                        {item.duration && (
                                                                            <small className="text-muted d-flex align-items-center">
                                                                                <BsClock className="me-1" /> {item.duration}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <EditButton
                                                                        text=""
                                                                        Icon={BsPencilSquare}
                                                                        onClick={() => handleEditItem(item.id)}
                                                                        inline={true}
                                                                        className="btn-edit-small"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))}
                                            </ListGroup>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>
                                            <div className="d-flex align-items-center">
                                                <BsFileText className="me-2 text-primary" />
                                                <span>Documentos e Aulas</span>
                                                <Badge bg="primary" className="ms-2">
                                                    {items.filter(i => i.type === "documento" || i.type === "aula").length}
                                                </Badge>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup variant="flush" className="material-list">
                                                {items
                                                    .filter(item => item.type === "documento" || item.type === "aula")
                                                    .map((item) => (
                                                        <ListGroup.Item key={item.id} className="material-item py-3">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    {item.icon}
                                                                    <div className="fw-bold">{item.label}</div>
                                                                </div>
                                                                <div>
                                                                    <EditButton
                                                                        text=""
                                                                        Icon={BsPencilSquare}
                                                                        onClick={() => handleEditItem(item.id)}
                                                                        inline={true}
                                                                        className="btn-edit-small"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))}
                                            </ListGroup>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>
                                            <div className="d-flex align-items-center">
                                                <BsUpload className="me-2 text-primary" />
                                                <span>Entregas e Avaliações</span>
                                                <Badge bg="primary" className="ms-2">
                                                    {items.filter(i => i.type === "entrega" || i.type === "trabalho" || i.type === "quiz").length}
                                                </Badge>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup variant="flush" className="material-list">
                                                {items
                                                    .filter(item => item.type === "entrega" || item.type === "trabalho" || item.type === "quiz")
                                                    .map((item) => (
                                                        <ListGroup.Item key={item.id} className="material-item py-3">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    {item.icon}
                                                                    <div>
                                                                        <div className="fw-bold">{item.label}</div>
                                                                        {item.deadline && (
                                                                            <Badge bg="warning" text="dark">
                                                                                <BsClock className="me-1" /> Prazo: {item.deadline}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <EditButton
                                                                        text=""
                                                                        Icon={BsPencilSquare}
                                                                        onClick={() => handleEditItem(item.id)}
                                                                        inline={true}
                                                                        className="btn-edit-small"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))}
                                            </ListGroup>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
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
                tiposPermitidos={curso?.tipo === 'S' ? ['documento', 'video', 'entrega'] : ['documento', 'video']} 
                courseId={cursoId} 
                allowDueDate={curso?.tipo !== 'A'} 
            />
            
            <ModalEditarFicheiro 
                show={editFile} 
                handleClose={() => setEditFile(false)} 
                allowDueDate={curso?.tipo !== 'A'} 
                itemId={editItemId}
            />
        </div>
    );
}