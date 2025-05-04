import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, ListGroup, Spinner,
  ProgressBar, Badge, Accordion, Button, Alert
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./pageCourse.css";
import {
  BsFillPeopleFill, BsCalendarCheck, BsFileText, BsCameraVideo, BsBook,
  BsTools, BsUpload, BsInfoCircle, BsExclamationTriangle, BsCheckCircle,
  BsQuestionCircle, BsTrophy, BsClock, BsDownload, BsFlag, BsPlayFill
} from "react-icons/bs";
import axios from "../../config/configAxios";
import ModalSubmeterTrabalho from '../../modals/formandos/submeterFicheiro';

export default function CursoFormando() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("sobre");
  const [progressPercent] = useState(35); // Simulação de progresso, idealmente viria da API
  const [showSubmeterModal, setShowSubmeterModal] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [materialLoading, setMaterialLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loadingFileId, setLoadingFileId] = useState(null);

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

  // 1. First, update your material fetching function in the course page component
  // to match the structure used in the modal

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!id) return;

      try {
        setMaterialLoading(true);
        const token = sessionStorage.getItem('token');

        // Using the same endpoint format that works in the modal
        const response = await axios.get(`/material/curso/${id}/materiais`, {
          headers: { Authorization: `${token}` }
        });

        if (response.data.success) {
          const materialsData = response.data.data;

          // Check if each material has files property with expected structure
          const hasFilesWithUrls = materialsData.some(m =>
            m.ficheiros &&
            m.ficheiros.length > 0 &&
            m.ficheiros[0].url
          );

          if (!hasFilesWithUrls) {
            const enhancedMaterials = await Promise.all(
              materialsData.map(async (material) => {
                try {
                  // Fetch complete material data like the modal does
                  const detailResponse = await axios.get(`/material/curso/${material.id}`, {
                    headers: { Authorization: `${token}` }
                  });

                  if (detailResponse.data) {
                    return detailResponse.data;
                  }
                  return material;
                } catch (error) {
                  console.error(`Error fetching details for material ${material.id}:`, error);
                  return material;
                }
              })
            );

            setMaterials(enhancedMaterials);
          } else {
            // Data already has the right structure
            setMaterials(materialsData);
          }
        } else {
          console.error("Error loading materials:", response.data.message);
        }
      } catch (err) {
        console.error("Error loading course materials:", err);
      } finally {
        setMaterialLoading(false);
      }
    };

    if (activeSection === "materiais") {
      fetchMaterials();
    }
  }, [id, activeSection, refreshTrigger]);

  // 2. Update your handleFileAction function to be more robust with different data structures
  // Função para abrir ou baixar um arquivo
  const handleFileAction = (file) => {
    // First check if we have a file object
    if (!file) {
      console.error("No file object provided");
      alert("Erro: Arquivo não disponível");
      return;
    }

    // Try to get URL using different possible property names
    let fileUrl = null;
    if (file.url) fileUrl = file.url;
    else if (file.ficheiro_url) fileUrl = file.ficheiro_url;
    else if (file.path) fileUrl = file.path;
    else if (file.link) fileUrl = file.link;

    // If we still don't have a URL, try to look deeper
    if (!fileUrl && typeof file === 'object') {

      // Check if any property might contain an object with URL
      for (const key in file) {
        if (
          typeof file[key] === 'object' &&
          file[key] !== null &&
          !Array.isArray(file[key]) &&
          file[key].url
        ) {
          fileUrl = file[key].url;
          break;
        }
      }
    }

    if (!fileUrl) {
      console.error("URL not found in file object:", file);
      alert("URL do arquivo não disponível. Por favor, tente novamente mais tarde.");
      return;
    }

    // Get file name and extension
    let fileName = file.nome || file.name || '';
    let extension = '';

    if (fileName) {
      extension = fileName.split('.').pop().toLowerCase();
    } else {
      // Try to extract filename from URL
      const urlParts = fileUrl.split('/');
      fileName = urlParts[urlParts.length - 1];
      extension = fileName.split('.').pop().toLowerCase();
    }

    try {
      // Check if it's a viewable file type
      const viewableExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm'];

      if (viewableExtensions.includes(extension)) {
        window.open(fileUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error processing file action:", error);
      alert("Erro ao processar o arquivo. Por favor, tente novamente mais tarde.");
    }
  };

  const objetivos = [
    "Compreender os princípios fundamentais da matéria",
    "Aplicar técnicas em situações práticas",
    "Desenvolver habilidades analíticas",
    "Criar soluções para problemas complexos",
    "Avaliar resultados e propor melhorias"
  ];

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

  // Group materials by type
  const getMaterialsByType = (tipo) => {
    return materials.filter(material => material.tipo === tipo);
  };

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

  // Função para determinar ícone com base na extensão do arquivo
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    // Document types
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return <BsFileText className="me-2" />;
    }
    // Video types
    else if (['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm'].includes(extension)) {
      return <BsCameraVideo className="me-2" />;
    }
    // Presentation types
    else if (['ppt', 'pptx'].includes(extension)) {
      return <BsBook className="me-2" />;
    }
    // Compressed files
    else if (['zip', 'rar', '7z'].includes(extension)) {
      return <BsTools className="me-2" />;
    }
    // Spreadsheets
    else if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return <BsFileText className="me-2" />;
    }
    // Default
    return <BsFileText className="me-2" />;
  };

  // Função para abrir o modal de submissão de trabalho
  const handleOpenSubmeterModal = (material) => {
    const avaliacaoInfo = {
      id: material.id,
      titulo: material.titulo,
      dataEntrega: material.data_entrega,
      descricao: material.descricao
    };
    setSelectedAvaliacao(avaliacaoInfo);
    setShowSubmeterModal(true);
  };

  // Função para fechar o modal de submissão de trabalho
  const handleCloseSubmeterModal = () => {
    setShowSubmeterModal(false);
  };

  // Função para lidar com o sucesso da submissão
  const handleSubmitSuccess = (submissaoData) => {
    // Atualizar o estado do app para refletir a submissão
    setRefreshTrigger(prev => prev + 1);
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
        <Button variant="outline-primary" onClick={() => navigate('/cursos')}>Voltar à página inicial</Button>
      </div>
    );
  }

  // Encontra o próximo prazo (usando a data de entrega mais próxima no futuro)
  const getPrazoProximo = () => {
    const entregas = materials.filter(m => m.tipo === 'entrega' && m.data_entrega);
    if (entregas.length === 0) return null;

    const hoje = new Date();
    const entregasFuturas = entregas.filter(e => new Date(e.data_entrega) > hoje);
    if (entregasFuturas.length === 0) return null;

    // Ordenar por data mais próxima
    entregasFuturas.sort((a, b) => new Date(a.data_entrega) - new Date(b.data_entrega));
    return entregasFuturas[0];
  };

  const proximoPrazo = getPrazoProximo();

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
                    {proximoPrazo && (
                      <Alert variant="warning" className="mt-3 d-flex align-items-center">
                        <BsClock className="me-2 text-warning" size={20} />
                        <div>
                          <strong>Próximo prazo:</strong><br />
                          {proximoPrazo.titulo} - {formatDate(proximoPrazo.data_entrega)}
                        </div>
                      </Alert>
                    )}
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

                {materialLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">A carregar materiais do curso...</p>
                  </div>
                ) : materials.length === 0 ? (
                  <Alert variant="light" className="text-center">
                    <BsInfoCircle className="me-2" />
                    Nenhum material disponível para este curso ainda.
                  </Alert>
                ) : (
                  // Organizando materiais por tipo
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
                          <p className="text-muted text-center py-3">Nenhum vídeo disponível</p>
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
                                            onClick={() => handleFileAction(file)}
                                            style={{ cursor: 'pointer' }}
                                            className="me-2 mb-1 text-decoration-none d-inline-flex align-items-center"
                                          >
                                            <BsDownload className="me-1" /> {file.nome.split('.').pop().toUpperCase()} • {file.nome}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    {/* Always render both buttons, just disable them when no files exist */}
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      className="me-2"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Stop event propagation
                                        if (material.ficheiros && material.ficheiros.length > 0) {
                                          handleFileAction(material.ficheiros[0]);
                                        }
                                      }}
                                      disabled={!material.ficheiros || material.ficheiros.length === 0 || loadingFileId === material.id}
                                    >
                                      {loadingFileId === material.id ? (
                                        <Spinner animation="border" size="sm" />
                                      ) : (
                                        <>
                                          <BsDownload className="me-1" /> Download
                                        </>
                                      )}
                                    </Button>

                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Stop event propagation
                                        if (material.ficheiros && material.ficheiros.length > 0) {
                                          handleFileAction(material.ficheiros[0]);
                                        }
                                      }}
                                      disabled={!material.ficheiros || material.ficheiros.length === 0}
                                    >
                                      Visualizar
                                    </Button>
                                  </div>
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
                          <p className="text-muted text-center py-3">Nenhum documento ou aula disponível</p>
                        ) : (
                          <ListGroup variant="flush" className="material-list">
                            {/* Listar documentos */}
                            {getMaterialsByType('documento').map((material) => (
                              <ListGroup.Item key={`doc-${material.id}`} className="material-item py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-start">
                                    {/* Content section */}
                                    <div className="me-3 text-primary">
                                      <BsFileText size={24} />
                                    </div>
                                    <div>
                                      <div className="fw-bold">{material.titulo}</div>
                                      {material.descricao && (
                                        <small className="text-muted d-block mb-2">{material.descricao}</small>
                                      )}
                                      <div>
                                        {material.ficheiros && material.ficheiros.map((file, idx) => (
                                          <Badge
                                            key={idx}
                                            bg="light"
                                            text="primary"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              handleFileAction(file);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                            className="me-2 mb-1 text-decoration-none d-inline-flex align-items-center"
                                          >
                                            <BsDownload className="me-1" />
                                            {(file.nome || file.name || '').split('.').pop().toUpperCase() || 'FILE'} •
                                            {file.nome || file.name || 'arquivo'}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="button-container" style={{ position: 'relative', zIndex: 10 }}>
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      className="me-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (material.ficheiros && material.ficheiros.length > 0) {
                                          handleFileAction(material.ficheiros[0]);
                                        }
                                      }}
                                      disabled={!material.ficheiros || material.ficheiros.length === 0}
                                    >
                                      <BsDownload className="me-1" /> Download
                                    </Button>

                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (material.ficheiros && material.ficheiros.length > 0) {
                                          handleFileAction(material.ficheiros[0]);
                                        }
                                      }}
                                      disabled={!material.ficheiros || material.ficheiros.length === 0}
                                    >
                                      Visualizar
                                    </Button>
                                  </div>
                                </div>
                              </ListGroup.Item>
                            ))}


                            {/* Listar aulas */}
                            {getMaterialsByType('aula').map((material) => (
                              <ListGroup.Item key={`aula-${material.id}`} className="material-item py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-start">
                                    <div className="me-3 text-success">
                                      <BsBook size={24} />
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
                                            text="success"
                                            onClick={() => handleFileAction(file)}
                                            style={{ cursor: 'pointer' }}
                                            className="me-2 mb-1 text-decoration-none d-inline-flex align-items-center"
                                          >
                                            <BsDownload className="me-1" /> {file.nome.split('.').pop().toUpperCase()} • {file.nome}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    {/* Always show the Download button but disable it when no files are available */}
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => material.ficheiros.length > 0 && handleFileAction(material.ficheiros[0])}
                                      disabled={material.ficheiros.length === 0}
                                    >
                                      <BsDownload className="me-1" /> Download
                                    </Button>
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={() => material.ficheiros.length > 0 && handleFileAction(material.ficheiros[0])}
                                      disabled={material.ficheiros.length === 0}
                                    >
                                      Visualizar
                                    </Button>
                                  </div>
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Entregas e Trabalhos */}
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        <div className="d-flex align-items-center">
                          <BsUpload className="me-2 text-warning" />
                          <span>Entregas e Avaliações</span>
                          <Badge bg="warning" text="dark" className="ms-2">
                            {getMaterialsByType('entrega').length + getMaterialsByType('trabalho').length}
                          </Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        {getMaterialsByType('entrega').length === 0 && getMaterialsByType('trabalho').length === 0 ? (
                          <p className="text-muted text-center py-3">Nenhuma entrega ou avaliação disponível</p>
                        ) : (
                          <ListGroup variant="flush" className="material-list">
                            {/* Listar trabalhos */}
                            {getMaterialsByType('trabalho').map((material) => (
                              <ListGroup.Item key={`trabalho-${material.id}`} className="material-item py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-start">
                                    <div className="me-3 text-info">
                                      <BsTools size={24} />
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
                                            text="info"
                                            onClick={() => handleFileAction(file)}
                                            style={{ cursor: 'pointer' }}
                                            className="me-2 mb-1 text-decoration-none d-inline-flex align-items-center"
                                          >
                                            <BsDownload className="me-1" /> {file.nome.split('.').pop().toUpperCase()} • {file.nome}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    {/* Always show the Download button but disable it when no files are available */}
                                    <Button
                                      variant="outline-info"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => material.ficheiros.length > 0 && handleFileAction(material.ficheiros[0])}
                                      disabled={material.ficheiros.length === 0}
                                    >
                                      <BsDownload className="me-1" /> Download
                                    </Button>
                                    <Button
                                      variant="info"
                                      size="sm"
                                      onClick={() => material.ficheiros.length > 0 && handleFileAction(material.ficheiros[0])}
                                      disabled={material.ficheiros.length === 0}
                                    >
                                      Visualizar
                                    </Button>
                                  </div>
                                </div>
                              </ListGroup.Item>
                            ))}

                            {/* Listar entregas */}
                            {getMaterialsByType('entrega').map((material) => (
                              <ListGroup.Item key={`entrega-${material.id}`} className="material-item py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-start">
                                    {/* Content section remains the same */}
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
                                            onClick={() => handleFileAction(file)}
                                            style={{ cursor: 'pointer' }}
                                            className="me-2 mb-1 text-decoration-none d-inline-flex align-items-center"
                                          >
                                            <BsDownload className="me-1" /> {file.nome.split('.').pop().toUpperCase()} • {file.nome}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <Button
                                      variant="outline-warning"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => material.ficheiros.length > 0 && handleFileAction(material.ficheiros[0])}
                                      disabled={material.ficheiros.length === 0}
                                    >
                                      <BsDownload className="me-1" /> Download
                                    </Button>
                                    <Button
                                      variant="warning"
                                      size="sm"
                                      onClick={() => handleOpenSubmeterModal(material)}
                                    >
                                      <BsUpload className="me-1" /> Submeter
                                    </Button>
                                  </div>
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