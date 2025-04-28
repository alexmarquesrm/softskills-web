import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Spinner } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import "./detailsCourse.css";
import { BsFillPeopleFill, BsCalendarCheck, BsPlusCircle, BsPencilSquare, BsFileText, 
         BsCameraVideo, BsBook, BsTools, BsUpload, BsInfoCircle, BsExclamationTriangle } from "react-icons/bs";
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
  const courseId = location.state?.id || id; // Fallback to URL param if state is not available
  
  const [addFile, setAddFile] = useState(false);
  const [editFile, setEditFile] = useState(false);
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materials, setMaterials] = useState([]);

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
          console.log("Dados do curso carregados:", foundCourse);
        } else {
          setError("Curso não encontrado");
        }

        
        // const materialsResponse = await axios.get(`/curso/${courseId}/materiais`, {
        //   headers: { Authorization: `${token}` }
        // });
        // setMaterials(materialsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados do curso:", err);
        setError("Não foi possível carregar os dados do curso");
        setLoading(false);
      }
    };

    fetchCursoData();
  }, [courseId]);

  // Default items list (could be replaced with data from API)
  const items = [
    { label: "Apresentação do curso", icon: <BsFileText className="me-2" />, type: "documento" },
    { label: "Vídeo 1", icon: <BsCameraVideo className="me-2" />, type: "video" },
    { label: "Vídeo 2", icon: <BsCameraVideo className="me-2" />, type: "video" },
    { label: "Aula Teórica 1", icon: <BsBook className="me-2" />, type: "aula" },
    { label: "Aula Teórica 2", icon: <BsBook className="me-2" />, type: "aula" },
    { label: "Aula Teórica 3", icon: <BsBook className="me-2" />, type: "aula" },
    { label: "Trabalho Prático 1", icon: <BsTools className="me-2" />, type: "trabalho" },
    { label: "Entrega Trabalho Prático 1", icon: <BsUpload className="me-2" />, type: "entrega" },
    { label: "Trabalho Prático 2", icon: <BsTools className="me-2" />, type: "trabalho" },
  ];

  const getFormadorNome = () => {
    return curso?.curso_sincrono?.sincrono_formador?.formador_colab?.nome || "Não especificado";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não especificado";
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

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
                  {curso?.curso_topico && curso.curso_topico.length > 0 && (
                    <span className="text-muted">
                      <BsInfoCircle className="me-2" />
                      {curso.curso_topico[0].descricao || "Tópico não especificado"}
                    </span>
                  )}
                </div>
              </div>
              <div className="curso-actions">
                <AddButton
                  text="Adicionar Material"
                  Icon={BsPlusCircle}
                  onClick={() => setAddFile(true)}
                  inline={true}
                  className="btn-gradient"
                />
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
                      <div>
                        <span style={{ fontWeight: "bold" }}>Professor: </span> 
                        {getFormadorNome()}
                      </div>
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

      <ModalAdicionarFicheiro show={addFile} handleClose={() => setAddFile(false)}  tiposPermitidos={['documento', 'video', 'entrega']} courseId={courseId} />
      <ModalEditarFicheiro show={editFile} handleClose={() => setEditFile(false)} />
    </div>
  );
}