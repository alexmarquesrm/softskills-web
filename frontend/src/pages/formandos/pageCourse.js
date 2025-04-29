import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, ListGroup, Spinner,
  ProgressBar, Badge, Accordion, Button, Alert
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./pageCourse.css";
import {
  BsFillPeopleFill, BsCalendarCheck, BsFileText, BsCameraVideo, BsBook,
  BsTools, BsUpload, BsInfoCircle, BsExclamationTriangle, BsCheckCircle,
  BsQuestionCircle, BsTrophy, BsClock, BsStarFill, BsDownload, BsFlag
} from "react-icons/bs";
import axios from "../../config/configAxios";
import ModalSubmeterTrabalho from '../../modals/formando/submeterFicheiro';

export default function CursoFormando() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("sobre");
  const [progressPercent] = useState(35); // Simulação de progresso, idealmente viria da API
  const [showSubmeterModal, setShowSubmeterModal] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);

  useEffect(() => {
    const fetchCursoData = async () => {
      if (!id) {
        setError("ID do curso não encontrado");
        setLoading(false);
        return;
      }

      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`/curso/${id}`, {
          headers: { Authorization: `${token}` },
        });

        setCurso(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar curso:", err);
        setError("Erro ao carregar os dados do curso");
        setLoading(false);
      }
    };

    fetchCursoData();
  }, [id]);

  const materiaisSincronos = [
    { id: 1, label: "Apresentação do curso", icon: <BsFileText className="me-2" />, type: "documento", downloadable: true },
    { id: 2, label: "Vídeo 1: Introdução", icon: <BsCameraVideo className="me-2" />, type: "video", duration: "15 min" },
    { id: 3, label: "Vídeo 2: Conceitos Básicos", icon: <BsCameraVideo className="me-2" />, type: "video", duration: "22 min" },
    { id: 4, label: "Aula Teórica 1: Fundamentos", icon: <BsBook className="me-2" />, type: "aula", downloadable: true },
    { id: 5, label: "Aula Teórica 2: Metodologia", icon: <BsBook className="me-2" />, type: "aula", downloadable: true },
    { id: 6, label: "Trabalho Prático 1", icon: <BsTools className="me-2" />, type: "trabalho", downloadable: true  },
    { id: 7, label: "Entrega Trabalho Prático 1", icon: <BsUpload className="me-2" />, type: "entrega", deadline: "15/05/2025",avaliacaoInfo: {id: 1, titulo: "Trabalho Prático 1", dataEntrega: "2025-05-15T23:59:59", descricao: "Realize a entrega do trabalho prático  conforme as instruções fornecidas no documento sobre o mesmo"}},
  ];

  const materiaisAssincronos = [
    { id: 1, label: "Apresentação do curso", icon: <BsFileText className="me-2" />, type: "documento", downloadable: true },
    { id: 2, label: "Vídeo 1: Introdução", icon: <BsCameraVideo className="me-2" />, type: "video", duration: "15 min" },
    { id: 3, label: "Vídeo 2: Conceitos Básicos", icon: <BsCameraVideo className="me-2" />, type: "video", duration: "22 min" },
    { id: 4, label: "Aula Teórica 1: Fundamentos", icon: <BsBook className="me-2" />, type: "aula", downloadable: true },
    { id: 5, label: "Quiz", icon: <BsTools className="me-2" />, type: "entrega" },
  ];

  const objetivos = [
    "Compreender os princípios fundamentais da matéria",
    "Aplicar técnicas em situações práticas",
    "Desenvolver habilidades analíticas",
    "Criar soluções para problemas complexos",
    "Avaliar resultados e propor melhorias"
  ];

  const items = curso?.tipo === "S" ? materiaisSincronos : materiaisAssincronos;

  const faqs = [
    {
      pergunta: "Como posso contactar o formador?",
      resposta: "Pode enviar uma mensagem através do fórum da plataforma ou utilizar o email disponibilizado no início do curso."
    },
    {
      pergunta: "Existe prazo para completar este curso?",
      resposta: "Sim, o curso deve ser concluído até à data final indicada nas informações gerais."
    },
    {
      pergunta: "Como são avaliados os trabalhos práticos?",
      resposta: "Os trabalhos são avaliados pelo formador segundo uma rubrica disponível na seção de avaliação."
    }
  ];

  const getFormadorNome = () => {
    return curso?.curso_sincrono?.sincrono_formador?.formador_colab?.nome || "Não especificado";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não especificado";
    return new Date(dateString).toLocaleDateString("pt-PT");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Função para abrir o modal de submissão de trabalho
  const handleOpenSubmeterModal = (avaliacao) => {
    setSelectedAvaliacao(avaliacao);
    setShowSubmeterModal(true);
  };

  // Função para fechar o modal de submissão de trabalho
  const handleCloseSubmeterModal = () => {
    setShowSubmeterModal(false);
  };

  // Função para lidar com o sucesso da submissão
  const handleSubmitSuccess = (submissaoData) => {
    console.log("Submissão realizada com sucesso:", submissaoData);
    // Aqui você poderia atualizar o estado do app para refletir a submissão
    // Por exemplo, marcar o item como completo, atualizar a lista de entregas, etc.
  };

  if (loading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" variant="primary" />
        <p className="ms-3 fw-bold">A carregar curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
        <BsExclamationTriangle size={48} className="text-danger mb-3" />
        <h3>Erro</h3>
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
            </Container>
          </div>

          {/* Barra de Progresso */}
          <div className="progress-section p-3 bg-light border-bottom">
            <Container>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold">Seu progresso no curso</h6>
                <span className="text-primary fw-bold">{progressPercent}%</span>
              </div>
              <ProgressBar
                now={progressPercent}
                variant="primary"
                className="progress-custom"
                style={{ height: "10px", borderRadius: "5px" }}
              />
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
                <Button
                  variant={activeSection === "faq" ? "primary" : "light"}
                  onClick={() => handleSectionChange("faq")}
                  className="me-2 mb-2"
                >
                  <BsQuestionCircle className="me-1" /> FAQ
                </Button>
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

                    {/* Próximo evento ou prazo */}
                    <Alert variant="warning" className="mt-3 d-flex align-items-center">
                      <BsClock className="me-2 text-warning" size={20} />
                      <div>
                        <strong>Próximo prazo:</strong><br />
                        Entrega do Trabalho Prático 1 - 15/05/2025
                      </div>
                    </Alert>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Seção "Materiais" */}
          {activeSection === "materiais" && (
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h4 className="section-subtitle mb-4">
                  <BsBook className="me-2 text-primary" />
                  Materiais do Curso
                </h4>

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
                          .map((item, idx) => (
                            <ListGroup.Item key={idx} className="material-item py-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  {item.completed ?
                                    <BsCheckCircle className="me-2 text-success" /> :
                                    <div className="me-2 uncompleted-circle"></div>
                                  }
                                  <div>
                                    <div className="fw-bold">{item.label}</div>
                                    <small className="text-muted d-flex align-items-center">
                                      <BsClock className="me-1" /> {item.duration}
                                    </small>
                                  </div>
                                </div>
                                <Button variant="outline-primary" size="sm">
                                  Assistir
                                </Button>
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
                          .map((item, idx) => (
                            <ListGroup.Item key={idx} className="material-item py-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  {item.completed ?
                                    <BsCheckCircle className="me-2 text-success" /> :
                                    <div className="me-2 uncompleted-circle"></div>
                                  }
                                  <div className="fw-bold">{item.label}</div>
                                </div>
                                <div>
                                  {item.downloadable && (
                                    <Button variant="outline-primary" size="sm" className="me-2">
                                      <BsDownload className="me-1" /> Download
                                    </Button>
                                  )}
                                  <Button variant="primary" size="sm">
                                    Visualizar
                                  </Button>
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
                          .map((item, idx) => (
                            <ListGroup.Item key={idx} className="material-item py-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  {item.completed ? (
                                    <BsCheckCircle className="me-2 text-success" />
                                  ) : (
                                    <div className="me-2 uncompleted-circle"></div>
                                  )}
                                  <div>
                                    <div className="fw-bold">{item.label}</div>
                                    {item.deadline && item.type !== "assíncrono" && (
                                      <Badge bg="warning" text="dark">
                                        <BsClock className="me-1" /> Prazo: {item.deadline}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  {item.type === "trabalho" ? (
                                    <>
                                      {item.downloadable && (
                                        <Button variant="outline-primary" size="sm" className="me-2">
                                          <BsDownload className="me-1" /> Download
                                        </Button>
                                      )}
                                      <Button variant="primary" size="sm">
                                        Visualizar
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      {item.downloadable && (
                                        <Button variant="outline-primary" size="sm" className="me-2">
                                          <BsDownload className="me-1" /> Download
                                        </Button>
                                      )}
                                      <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => handleOpenSubmeterModal(item.avaliacaoInfo)}
                                      >
                                        Submeter
                                      </Button>
                                    </>
                                  )}
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
                <h4 className="section-subtitle mb-4">
                  <BsFlag className="me-2 text-primary" />
                  Objetivos de Aprendizagem
                </h4>

                <Row>
                  <Col md={12}>
                    <div className="objectives-container p-4 bg-light rounded">
                      <h5 className="mb-3">Ao concluir este curso, você será capaz de:</h5>
                      <ListGroup variant="flush">
                        {objetivos.map((objetivo, idx) => (
                          <ListGroup.Item key={idx} className="bg-transparent border-0 py-2">
                            <div className="d-flex">
                              <div className="objective-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ minWidth: "30px", height: "30px" }}>
                                {idx + 1}
                              </div>
                              <div>{objetivo}</div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  </Col>
                </Row>

                <div className="certification-info mt-4 p-4 bg-primary bg-opacity-10 rounded">
                  <div className="d-flex align-items-center mb-3">
                    <BsTrophy className="me-2 text-primary" size={24} />
                    <h5 className="mb-0">Certificação</h5>
                  </div>
                  <p className="mb-0">
                    Ao completar este curso com sucesso e obtendo uma classificação mínima de 70%,
                    receberá um certificado digital que pode ser adicionado ao seu perfil profissional.
                  </p>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Seção "FAQ" */}
          {activeSection === "faq" && (
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h4 className="section-subtitle mb-4">
                  <BsQuestionCircle className="me-2 text-primary" />
                  Perguntas Frequentes
                </h4>

                <Accordion className="faq-accordion">
                  {faqs.map((faq, idx) => (
                    <Accordion.Item eventKey={idx.toString()} key={idx}>
                      <Accordion.Header>
                        <span className="fw-bold">{faq.pergunta}</span>
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="mb-0">{faq.resposta}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>

                <div className="additional-help mt-4 p-4 bg-light rounded">
                  <div className="d-flex align-items-center mb-3">
                    <BsInfoCircle className="me-2 text-primary" size={24} />
                    <h5 className="mb-0">Precisa de mais ajuda?</h5>
                  </div>
                  <p className="mb-3">
                    Se não encontrou resposta para a sua questão, pode contactar-nos de uma das seguintes formas:
                  </p>
                  <Row>
                    <Col md={12}>
                      <Button variant="outline-primary" className="w-100 mb-2">
                        <BsFillPeopleFill className="me-2" /> Contactar Formador
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </Container>

      {/* Modal de Submissão de Trabalho */}
      <ModalSubmeterTrabalho 
        show={showSubmeterModal} 
        handleClose={handleCloseSubmeterModal}
        avaliacao={selectedAvaliacao}
        onSubmitSuccess={handleSubmitSuccess}
        cursoId={id}
        moduloId={null} // Adicionar moduloId se necessário
      />
    </div>
  );
}