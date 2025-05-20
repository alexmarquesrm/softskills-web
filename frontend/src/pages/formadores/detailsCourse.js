import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, ListGroup, Spinner,
  Badge, Accordion, Button, Alert
} from "react-bootstrap";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./detailsCourse.css";
import {
  BsFillPeopleFill, BsCalendarCheck, BsPlusCircle, BsPencilSquare, BsFileText,
  BsCameraVideo, BsBook, BsTools, BsUpload, BsInfoCircle, BsExclamationTriangle,
  BsCheckCircle, BsClock, BsTrophy, BsFlag, BsDownload, BsPlayFill
} from "react-icons/bs";
import axios from "../../config/configAxios";

/* COMPONENTES */
import AddButton from "../../components/buttons/addButton";
import EditButton from "../../components/buttons/editButton";
/* MODALS */
import ModalAdicionarFicheiro from "../../modals/addFile";
import ModalEditarFicheiro from "../../modals/edditFile";

export default function CursoDetalhes() {
  const { id } = useParams(); // Get ID from URL parameter
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state?.id || id; // Fallback to URL param if state is not available

  const [addFile, setAddFile] = useState(false);
  const [editFile, setEditFile] = useState(false);
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [activeSection, setActiveSection] = useState("sobre");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [materialLoading, setMaterialLoading] = useState(false);
  const [selectedCursoId, setSelectedCursoId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [alunosLoading, setAlunosLoading] = useState(false);

  // Fetch course data based on the ID
  useEffect(() => {
    const fetchCursoData = async () => {
      if (!courseId) {
        setError("ID do curso não encontrado");
        setLoading(false);
        return;
      }

      try {
        const token = sessionStorage.getItem('token');
        const formadorId = sessionStorage.getItem('colaboradorid');

        // Get all instructor courses first
        const response = await axios.get(`/curso/formador/${formadorId}`, {
          headers: { Authorization: `${token}` }
        });

        // Find the specific course in the returned data
        const foundCourse = response.data.find(c => c.curso_id.toString() === courseId.toString());

        if (foundCourse) {
          setCurso(foundCourse);
          setSelectedCursoId(foundCourse.curso_id);
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
  }, [courseId]);

  // Fetch course materials when the active section changes to "materiais"
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!selectedCursoId) return;

      try {
        setMaterialLoading(true);
        const token = sessionStorage.getItem('token');

        const response = await axios.get(`/material/curso/${selectedCursoId}/materiais`, {
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
  }, [selectedCursoId, activeSection, refreshTrigger]);

  // Fetch alunos when the active section changes to "alunos"
  useEffect(() => {
    const fetchAlunos = async () => {
      if (!courseId || curso?.tipo !== 'S') return;

      try {
        setAlunosLoading(true);
        const token = sessionStorage.getItem('token');

        const response = await axios.get(`/curso/${courseId}/alunos`, {
          headers: { Authorization: `${token}` }
        });

        if (response.data.success) {
          setAlunos(response.data.data);
        } else {
          console.error("Erro ao carregar alunos:", response.data.message);
        }
      } catch (err) {
        console.error("Erro ao carregar alunos do curso:", err);
      } finally {
        setAlunosLoading(false);
      }
    };

    if (activeSection === "alunos") {
      fetchAlunos();
    }
  }, [courseId, activeSection, curso?.tipo]);

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
    // Trigger a refresh of materials list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdateSuccess = (updatedMaterial, isDeleted = false) => {
    // Refresh materials after update or deletion
    setRefreshTrigger(prev => prev + 1);
  };

  // Group materials by type and section
  const getMaterialsByType = (tipo) => {
    const materialsOfType = materials.filter(material => material.tipo === tipo);
    
    // Group by section
    const groupedBySection = materialsOfType.reduce((acc, material) => {
      const section = material.secao || 'Sem Seção';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(material);
      return acc;
    }, {});

    return groupedBySection;
  };

  // Função para agrupar trabalho e entrega juntos por seção
  const getTrabalhoEntregaBySection = () => {
    const filtered = materials.filter(m => m.tipo === 'trabalho' || m.tipo === 'entrega');
    return filtered.reduce((acc, material) => {
      const section = material.secao || 'Sem Seção';
      if (!acc[section]) acc[section] = [];
      acc[section].push(material);
      return acc;
    }, {});
  };

  // Adicione esta função ao seu componente
  const handleFileAction = (file) => {
    if (!file.url) {
      console.error("URL do arquivo não disponível");
      // Aqui você pode mostrar uma mensagem de erro para o usuário
      return;
    }

    // Verificar se é um arquivo que pode ser aberto no navegador
    const viewableExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm'];
    const extension = file.nome.split('.').pop().toLowerCase();

    if (viewableExtensions.includes(extension)) {
      // Abrir em nova aba
      window.open(file.url, '_blank');
    } else {
      // Forçar download para outros tipos de arquivo
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Desconhecido';

    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Não especificado";
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  // Determine icon based on file extension
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

  const getFormadorNome = () => {
    return curso?.curso_sincrono?.sincrono_formador?.formador_colab?.nome || "Não especificado";
  };

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
        <Button variant="outline-primary" onClick={() => navigate('/cursos')}>Voltar à página inicial</Button>
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
              <div className="d-flex justify-content-between align-items-center flex-wrap">
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
                  variant={activeSection === "alunos" ? "primary" : "light"}
                  onClick={() => handleSectionChange("alunos")}
                  className="me-2 mb-2"
                >
                  <BsFillPeopleFill className="me-1" /> Alunos
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

                    {/* Próxima ação para o formador */}
                    <Alert variant="info" className="mt-3 d-flex align-items-center">
                      <BsInfoCircle className="me-2 text-info" size={20} />
                      <div>
                        <strong>Ações Pendentes:</strong><br />
                        Avaliar trabalhos entregues pelos formandos
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="section-subtitle mb-0">
                    <BsBook className="me-2 text-primary" />
                    Materiais do Curso
                  </h4>
                  <div className="curso-actions">
                    <AddButton
                      text="Adicionar Material"
                      Icon={BsPlusCircle}
                      onClick={handleAddContent}
                      inline={true}
                      className="btn-action"
                    />
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
                  // Organizando materiais por tipo
                  <Accordion defaultActiveKey={[]} alwaysOpen className="material-accordion">
                    {/* Vídeos */}
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <div className="d-flex align-items-center">
                          <BsCameraVideo className="me-2 text-danger" />
                          <span>Vídeos</span>
                          <Badge bg="danger" className="ms-2">
                            {Object.values(getMaterialsByType('video')).reduce((acc, section) => acc + section.length, 0)}
                          </Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        {Object.keys(getMaterialsByType('video')).length === 0 ? (
                          <p className="text-muted text-center py-3">Nenhum vídeo adicionado</p>
                        ) : (
                          Object.entries(getMaterialsByType('video')).map(([section, materials]) => (
                            <div key={section} className="mb-4">
                              <h6 className="fw-bold mb-3 text-primary">{section}</h6>
                              <ListGroup variant="flush" className="material-list">
                                {materials.map((material) => (
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
                            </div>
                          ))
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
                            {Object.values(getMaterialsByType('documento')).reduce((acc, section) => acc + section.length, 0) +
                             Object.values(getMaterialsByType('aula')).reduce((acc, section) => acc + section.length, 0)}
                          </Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        {Object.keys(getMaterialsByType('documento')).length === 0 && 
                         Object.keys(getMaterialsByType('aula')).length === 0 ? (
                          <p className="text-muted text-center py-3">Nenhum documento ou aula adicionado</p>
                        ) : (
                          <>
                            {/* Documentos */}
                            {Object.entries(getMaterialsByType('documento')).map(([section, materials]) => (
                              <div key={`doc-${section}`} className="mb-4">
                                <h6 className="fw-bold mb-3 text-primary">{section}</h6>
                                <ListGroup variant="flush" className="material-list">
                                  {materials.map((material) => (
                                    <ListGroup.Item key={`doc-${material.id}`} className="material-item py-3">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-start">
                                          <div className="me-3 text-primary">
                                            <BsFileText size={24} />
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
                              </div>
                            ))}

                            {/* Aulas */}
                            {Object.entries(getMaterialsByType('aula')).map(([section, materials]) => (
                              <div key={`aula-${section}`} className="mb-4">
                                <h6 className="fw-bold mb-3 text-success">{section}</h6>
                                <ListGroup variant="flush" className="material-list">
                                  {materials.map((material) => (
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
                              </div>
                            ))}
                          </>
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
                            {Object.values(getTrabalhoEntregaBySection()).reduce((acc, arr) => acc + arr.length, 0)}
                          </Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        {Object.keys(getTrabalhoEntregaBySection()).length === 0 ? (
                          <p className="text-muted text-center py-3">Nenhuma entrega ou trabalho adicionado</p>
                        ) : (
                          Object.entries(getTrabalhoEntregaBySection()).map(([section, materials]) => (
                            <div key={section} className="mb-4">
                              <h6 className="fw-bold mb-3 text-info">{section}</h6>
                              <ListGroup variant="flush" className="material-list">
                                {materials
                                  .slice()
                                  .sort((a, b) => {
                                    if (a.tipo === b.tipo) return 0;
                                    if (a.tipo === 'trabalho') return -1;
                                    if (b.tipo === 'trabalho') return 1;
                                    return 0;
                                  })
                                  .map((material) => (
                                    <ListGroup.Item key={material.id} className="material-item py-3">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-start">
                                          <div className={material.tipo === 'trabalho' ? 'me-3 text-info' : 'me-3 text-warning'}>
                                            {material.tipo === 'trabalho' ? <BsTools size={24} /> : <BsUpload size={24} />}
                                          </div>
                                          <div>
                                            <div className="fw-bold">{material.titulo}</div>
                                            {material.descricao && (
                                              <small className="text-muted d-block mb-2">{material.descricao}</small>
                                            )}
                                            {material.data_entrega && (
                                              <Badge bg={material.tipo === 'trabalho' ? 'info' : 'warning'} text="dark" className="mb-2">
                                                <BsClock className="me-1" /> Prazo: {formatDate(material.data_entrega)}
                                              </Badge>
                                            )}
                                            <div>
                                              {material.ficheiros && material.ficheiros.map((file, idx) => (
                                                <Badge
                                                  key={idx}
                                                  bg="light"
                                                  text={material.tipo === 'trabalho' ? 'info' : 'warning'}
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
                            </div>
                          ))
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                )}
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
                      Inscritos: {alunos.length} Alunos
                    </Badge>
                  </div>
                </div>

                {alunosLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">A carregar alunos...</span>
                    </Spinner>
                    <p className="mt-2">A carregar lista de alunos...</p>
                  </div>
                ) : alunos.length === 0 ? (
                  <Alert variant="light" className="text-center">
                    <BsInfoCircle className="me-2" />
                    Nenhum aluno inscrito neste curso ainda.
                  </Alert>
                ) : (
                  <ListGroup variant="flush" className="material-list">
                    {alunos.map((aluno) => (
                      <ListGroup.Item key={aluno.id} className="material-item py-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="formador-avatar bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
                              <BsFillPeopleFill size={20} />
                            </div>
                            <div>
                              <div className="fw-bold">{aluno.nome}</div>
                              <small className="text-muted">{aluno.email}</small>
                              <div className="mt-1">
                                <small className="text-muted">
                                  Inscrito em: {formatDate(aluno.data_inscricao)}
                                </small>
                              </div>
                            </div>
                          </div>
                          <Badge bg={aluno.estado === 'Concluído' ? 'success' : 'warning'}>
                            {aluno.estado}
                          </Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          )}
        </div>
      </Container>

      <ModalAdicionarFicheiro
        show={addFile}
        handleClose={() => setAddFile(false)}
        tiposPermitidos={['documento', 'video', 'entrega', 'trabalho', 'aula']}
        courseId={selectedCursoId}
        onUploadSuccess={handleUploadSuccess}
      />

      <ModalEditarFicheiro
        show={editFile}
        handleClose={() => setEditFile(false)}
        fileId={selectedFileId}
        cursoId={selectedCursoId}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}