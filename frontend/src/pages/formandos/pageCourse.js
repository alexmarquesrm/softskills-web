import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Spinner, Badge, Accordion, Button, Alert, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  BsFillPeopleFill, BsCalendarCheck, BsFileText, BsCameraVideo, BsBook,
  BsTools, BsUpload, BsInfoCircle, BsExclamationTriangle, BsCheckCircle,
  BsQuestionCircle, BsTrophy, BsClock, BsDownload, BsFlag, BsPlayFill, BsAward, BsStarFill
} from "react-icons/bs";
import axios from "../../config/configAxios";
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
// COMPONENTES
import Inscrever from "../../components/buttons/saveButton";
import Cancelar from "../../components/buttons/cancelButton";
import ModalSubmeterTrabalho from '../../modals/formandos/submeterFicheiro';
import QuizModal from '../../modals/formandos/QuizModal';
import VideoModal from '../../modals/formandos/VideoModal';
// ICONS
import { BsArrowReturnLeft } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import CustomBreadcrumb from "../../components/Breadcrumb";
// CSS
import "./pageCourse.css";

// Map global para rastrear inscrições em curso por curso
const inscricoesEmCurso = new Map();

export default function CursoFormando() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("sobre");
  const [inscricao, setInscricao] = useState(null);
  const [showSubmeterModal, setShowSubmeterModal] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [materialLoading, setMaterialLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loadingFileId] = useState(null);
  const [showAvaliarFormadorModal, setShowAvaliarFormadorModal] = useState(false);
  const [avaliacaoFormador, setAvaliacaoFormador] = useState(0);
  const [errorAvaliacao, setErrorAvaliacao] = useState("");
  const [formadorJaAvaliado, setFormadorJaAvaliado] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const breadcrumbItems = [
    { label: 'Formando', path: '/formando' },
    { label: 'Cursos', path: '/formando/cursos' },
    { label: 'Detalhes do Curso', path: `/formando/curso/${id}` }
  ];

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

  useEffect(() => {
    const fetchDataInscricao = async () => {
      try {
        const response = await axios.get('/inscricao/minhas');
        const cursoId = Number(id);

        const inscricaoDoCurso = response.data.find(
          (inscricao) => inscricao.curso_id === cursoId
        );

        if (inscricaoDoCurso !== undefined) {
          setInscricao(inscricaoDoCurso);
        } else {
          setInscricao(null);
        }

        // Verificar se o formador já foi avaliado
        if (inscricaoDoCurso?.nota !== null && curso?.tipo === "S") {
          try {
            const token = sessionStorage.getItem('token');
            const formadorId = curso?.curso_sincrono?.formador_id;

            if (formadorId) {
              const avaliacoesResponse = await axios.get(`/avaliacao-formador?curso_id=${id}&formador_id=${formadorId}`, {
                headers: { Authorization: `${token}` }
              });

              setFormadorJaAvaliado(avaliacoesResponse.data.length > 0);
            }
          } catch (error) {
            console.error("Erro ao verificar avaliação do formador:", error);
          }
        }

      } catch (err) {
        console.error("Erro ao carregar inscrições:", err);
        // Se houver erro ao carregar inscrições, assumir que não está inscrito
        setInscricao(null);
      }
    };

    fetchDataInscricao();
  }, [id, curso]);

  // 1. First, update your material fetching function in the course page component
  // to match the structure used in the modal

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!id) return;

      try {
        setMaterialLoading(true);
        const token = sessionStorage.getItem('token');

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

  // Add this new useEffect to fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      console.log('Fetching quizzes...', { id, curso });
      if (!id || !curso) {
        console.log('Missing id or curso, skipping quiz fetch');
        return;
      }

      try {
        setQuizLoading(true);
        const token = sessionStorage.getItem('token');
        console.log('Making API call to fetch quizzes...');
        const response = await axios.get(`/quizz/curso/${id}`, {
          headers: { Authorization: `${token}` }
        });

        if (response.data.success) {
          console.log('Quizzes loaded successfully:', response.data.data);
          setQuizzes(response.data.data);
        } else {
          console.log('Failed to load quizzes:', response.data);
        }
      } catch (err) {
        console.error("Error loading quizzes:", err);
        toast.error("Erro ao carregar os quizzes");
      } finally {
        setQuizLoading(false);
      }
    };

    if (activeSection === "materiais") {
      console.log('Active section is materiais, fetching quizzes...');
      fetchQuizzes();
    }
  }, [id, activeSection, curso]);

  const handleInscricao = async (e) => {
    // Prevenir múltiplos cliques - verificar estado local e global
    if (clicked || inscricoesEmCurso.has(id)) {
      return;
    }
    
    // Definir imediatamente para bloquear outros cliques
    setClicked(true);
    inscricoesEmCurso.set(id, true);

    try {
      const token = sessionStorage.getItem('token');
      const idColab = sessionStorage.getItem('colaboradorid');

      let inscricaoData = {
        formando_id: idColab,
        curso_id: id
      };

      const response = await axios.post('/inscricao/criar', inscricaoData, {
        headers: { Authorization: `${token}` }
      });

      toast.success("Inscrição realizada com sucesso!");

      // Atualizar o estado local para refletir que está inscrito
      setInscricao({ curso_id: Number(id) });

      setTimeout(() => {
        navigate('/utilizadores/lista/cursos');
      }, 2000);

    } catch (error) {
      console.error("Erro ao inscrever", error);
      if (error.response?.data?.erro === "Um formador não pode se inscrever no próprio curso") {
        toast.error("Você não pode se inscrever neste curso pois é o formador.");
      } else if (error.response?.data?.erro === "Formando já está inscrito neste curso") {
        toast.warning("Você já está inscrito neste curso!");
        // Atualizar o estado local para refletir que está inscrito
        setInscricao({ curso_id: Number(id) });
      } else if (error.response?.data?.erro === "Curso já atingiu o limite de vagas") {
        toast.error("Este curso já atingiu o limite de vagas disponíveis.");
      } else {
        toast.error("Não foi possível inscrever no curso. Por favor, avise o gestor.");
      }
    } finally {
      // Remover do map global e reativar botão após delay
      inscricoesEmCurso.delete(id);
      setTimeout(() => {
        setClicked(false);
      }, 1000);
    }
  };

  // Função para abrir ou download de um arquivo
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

  // Função para agrupar materiais por tipo e seção
  const getMaterialsByTypeAndSection = (tipoArray) => {
    const filtered = materials.filter(m => tipoArray.includes(m.tipo));
    return filtered.reduce((acc, material) => {
      const section = material.secao || 'Sem Seção';
      if (!acc[section]) acc[section] = [];
      acc[section].push(material);
      return acc;
    }, {});
  };

  const getFormadorNome = () => {
    return curso?.curso_sincrono?.sincrono_formador?.formador_colab?.nome || "Não especificado";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não especificado";
    try {
      return new Date(dateString).toLocaleDateString("pt-PT");
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Função para abrir o modal de submissão de trabalho
  const handleOpenSubmeterModal = (material) => {
    
    if (!material || !material.material_id) {
      console.error('Material inválido:', material);
      toast.error("Erro ao abrir submissão: material inválido");
      return;
    }

    const avaliacaoInfo = {
      id: material.material_id,
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

  // Add this new function to handle certificate generation and download
  const handleCertificateDownload = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();

      // Add background color
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 0, 210, 297, 'F');

      // Add border
      doc.setDrawColor(40, 167, 69);
      doc.setLineWidth(2);
      doc.rect(10, 10, 190, 277);

      // Add title
      doc.setFontSize(24);
      doc.setTextColor(40, 167, 69);
      doc.text('Certificado de Conclusão', 105, 40, { align: 'center' });

      // Add decorative line
      doc.setDrawColor(40, 167, 69);
      doc.setLineWidth(0.5);
      doc.line(40, 50, 170, 50);

      // Add content
      doc.setFontSize(12);
      doc.setTextColor(51, 51, 51);

      const formando = sessionStorage.getItem('nome');
      const nomeFormando = formando || 'Formando';
      const nomeCurso = curso?.titulo || 'Curso';
      const dataConclusao = new Date().toLocaleDateString('pt-PT');
      const nivel = curso?.nivel || 'N/A';
      const totalHoras = curso?.total_horas || 'N/A';
      const formador = getFormadorNome();

      // Add certificate text
      doc.setFontSize(14);
      doc.text('Certificamos que', 105, 80, { align: 'center' });

      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(nomeFormando, 105, 95, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.text('concluiu com êxito o curso', 105, 110, { align: 'center' });

      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(nomeCurso, 105, 125, { align: 'center' });

      // Add course details
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(`Nível: ${nivel}`, 105, 150, { align: 'center' });
      doc.text(`Carga Horária: ${totalHoras} horas`, 105, 160, { align: 'center' });
      doc.text(`Data de Conclusão: ${dataConclusao}`, 105, 170, { align: 'center' });

      // Add formador
      doc.text('Formador:', 105, 190, { align: 'center' });
      doc.setFont(undefined, 'bold');
      doc.text(formador, 105, 200, { align: 'center' });

      // Add footer
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(128, 128, 128);
      doc.text('Este certificado é gerado automaticamente e não requer assinatura digital.', 105, 250, { align: 'center' });

      // Save the PDF
      doc.save(`certificado_${nomeCurso}.pdf`);

      toast.success("Certificado gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar certificado:", error);
      toast.error("Não foi possível gerar o certificado. Por favor, tente novamente mais tarde.");
    }
  };

  const handleAvaliarFormador = async () => {
    if (!avaliacaoFormador) {
      setErrorAvaliacao("Por favor, selecione uma avaliação");
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      // Corrigindo a forma de obter o ID do formador baseado na estrutura real
      const formadorId = curso?.curso_sincrono?.formador_id;

      console.log('Dados do curso:', curso);
      console.log('ID do formador:', formadorId);

      if (!formadorId) {
        toast.error("Não foi possível identificar o formador");
        return;
      }

      await axios.post('/avaliacao-formador', {
        curso_id: id,
        formador_id: formadorId,
        avaliacao: avaliacaoFormador
      }, {
        headers: { Authorization: `${token}` }
      });

      toast.success("Avaliação enviada com sucesso!");
      setShowAvaliarFormadorModal(false);
      setAvaliacaoFormador(0);
      setErrorAvaliacao("");
      setFormadorJaAvaliado(true);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Não foi possível enviar a avaliação. Por favor, tente novamente.");
    }
  };

  // Add this new function to handle quiz start
  const handleStartQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setShowQuizModal(true);
  };

  // Add this new function to handle video viewing
  const handleViewVideo = (material) => {
    if (!material.ficheiros || material.ficheiros.length === 0) return;
    
    const videoFile = material.ficheiros[0];
    setSelectedVideo({
      url: videoFile.url,
      title: material.titulo
    });
    setShowVideoModal(true);
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
    if (!materials || !Array.isArray(materials)) return null;
    
    const entregas = materials.filter(m => m?.tipo === 'entrega' && m?.data_entrega);
    if (entregas.length === 0) return null;

    const hoje = new Date();
    const entregasFuturas = entregas.filter(e => {
      try {
        return new Date(e.data_entrega) > hoje;
      } catch (error) {
        console.error("Erro ao processar data de entrega:", error);
        return false;
      }
    });
    
    if (entregasFuturas.length === 0) return null;

    // Ordenar por data mais próxima
    entregasFuturas.sort((a, b) => {
      try {
        return new Date(a.data_entrega) - new Date(b.data_entrega);
      } catch (error) {
        console.error("Erro ao ordenar datas:", error);
        return 0;
      }
    });
    
    return entregasFuturas[0];
  };

  const proximoPrazo = getPrazoProximo();

  return (
    <div className="course-page">
      <Container>
        <CustomBreadcrumb items={breadcrumbItems} />
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

                    {inscricao !== null && new Date(curso.curso_sincrono.data_inicio) <= new Date() && (
                      <Button variant={activeSection === "materiais" ? "primary" : "light"} onClick={() => handleSectionChange("materiais")} className="me-2 mb-2">
                        <BsBook className="me-1" /> Materiais
                      </Button>
                    )}
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

                              {/* Adicionar botão de certificado quando o curso estiver concluído */}
                              {inscricao && inscricao.nota != null && (inscricao.estado === true) && (
                                <li className="mt-3">
                                  <div className="d-flex flex-column gap-2">
                                    <Button
                                      variant="success"
                                      className="certificate-button w-100"
                                      onClick={handleCertificateDownload}
                                    >
                                      <BsAward className="me-2" />
                                      Gerar Certificado
                                    </Button>

                                    {/* Botão de avaliar formador */}
                                    {curso?.tipo === "S" && !formadorJaAvaliado && curso?.curso_sincrono?.estado === true &&(
                                      <Button
                                        variant="primary"
                                        className="w-100"
                                        onClick={() => setShowAvaliarFormadorModal(true)}
                                      >
                                        <BsStarFill className="me-2" />
                                        Avaliar Formador
                                      </Button>
                                    )}

                                    {/* Mensagem quando o formador já foi avaliado */}
                                    {curso?.tipo === "S" && formadorJaAvaliado && curso?.curso_sincrono?.estado === true && (
                                      <div className="text-success d-flex align-items-center">
                                        <BsCheckCircle className="me-2" />
                                        Formador já avaliado
                                      </div>
                                    )}
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
                    ) : (materials.length > 0 || (curso?.tipo === 'A' && quizzes.length > 0)) ? (
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
                            {Object.keys(getMaterialsByTypeAndSection(['video'])).length === 0 ? (
                              <p className="text-muted text-center py-3">Nenhum vídeo disponível</p>
                            ) : (
                              Object.entries(getMaterialsByTypeAndSection(['video']))
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([section, materials]) => (
                                  <div key={section} className="mb-4">
                                    <h6 className="fw-bold mb-3 text-danger">{section}</h6>
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
                                            <div>
                                              <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={(e) => {
                                                  e.stopPropagation();
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
                                                  e.stopPropagation();
                                                  if (material.ficheiros && material.ficheiros.length > 0) {
                                                    handleViewVideo(material);
                                                  }
                                                }}
                                                disabled={!material.ficheiros || material.ficheiros.length === 0}
                                              >
                                                <BsPlayFill className="me-1" /> Visualizar
                                              </Button>
                                            </div>
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
                                {getMaterialsByType('documento').length + getMaterialsByType('aula').length}
                              </Badge>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            {Object.keys(getMaterialsByTypeAndSection(['documento', 'aula'])).length === 0 ? (
                              <p className="text-muted text-center py-3">Nenhum documento ou aula disponível</p>
                            ) : (
                              Object.entries(getMaterialsByTypeAndSection(['documento', 'aula']))
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([section, materials]) => (
                                  <div key={section} className="mb-4">
                                    <h6 className="fw-bold mb-3 text-primary">{section}</h6>
                                    <ListGroup variant="flush" className="material-list">
                                      {materials.map((material) => (
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
                                            <div>
                                              {material.tipo === 'entrega' ? (
                                                <Button
                                                  variant="warning"
                                                  size="sm"
                                                  onClick={() => handleOpenSubmeterModal(material)}
                                                  disabled={new Date(material.data_entrega) < new Date()}
                                                >
                                                  <BsUpload className="me-1" /> 
                                                  {new Date(material.data_entrega) < new Date() ? 'Prazo Expirado' : 'Submeter'}
                                                </Button>
                                              ) : (
                                                <Button
                                                  variant="outline-info"
                                                  size="sm"
                                                  className="me-2"
                                                  onClick={() => material.ficheiros.length > 0 && handleFileAction(material.ficheiros[0])}
                                                  disabled={material.ficheiros.length === 0}
                                                >
                                                  <BsDownload className="me-1" /> Download
                                                </Button>
                                              )}
                                            </div>
                                          </div>
                                        </ListGroup.Item>
                                      ))}
                                    </ListGroup>
                                  </div>
                                ))
                            )}
                          </Accordion.Body>
                        </Accordion.Item>

                        {/* Entregas e Avaliações */}
                        <Accordion.Item eventKey="2">
                          <Accordion.Header>
                            <div className="d-flex align-items-center">
                              <BsUpload className="me-2 text-warning" />
                              <span>Entregas e Avaliações</span>
                              <Badge bg="warning" text="dark" className="ms-2">
                                {Object.values(getTrabalhoEntregaBySection()).reduce((acc, arr) => acc + arr.length, 0)}
                              </Badge>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            {Object.keys(getTrabalhoEntregaBySection()).length === 0 ? (
                              <p className="text-muted text-center py-3">Nenhuma entrega ou avaliação disponível</p>
                            ) : (
                              Object.entries(getTrabalhoEntregaBySection())
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([section, materials]) => (
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
                                        .map((material) => {
                                          return (
                                            <ListGroup.Item key={material.material_id} className="material-item py-3">
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
                                                <div>
                                                  {material.tipo === 'entrega' ? (
                                                    <Button
                                                      variant="warning"
                                                      size="sm"
                                                      onClick={() => {
                                                        handleOpenSubmeterModal(material);
                                                      }}
                                                      disabled={new Date(material.data_entrega) < new Date()}
                                                    >
                                                      <BsUpload className="me-1" /> 
                                                      {new Date(material.data_entrega) < new Date() ? 'Prazo Expirado' : 'Submeter'}
                                                    </Button>
                                                  ) : (
                                                    <Button
                                                      variant="outline-info"
                                                      size="sm"
                                                      className="me-2"
                                                      onClick={() => material.ficheiros.length > 0 && handleFileAction(material.ficheiros[0])}
                                                      disabled={material.ficheiros.length === 0}
                                                    >
                                                      <BsDownload className="me-1" /> Download
                                                    </Button>
                                                  )}
                                                </div>
                                              </div>
                                            </ListGroup.Item>
                                          );
                                        })}
                                    </ListGroup>
                                  </div>
                                ))
                            )}
                          </Accordion.Body>
                        </Accordion.Item>

                        {/* Quizzes */}
                        {curso?.tipo === 'A' && (
                          <Accordion.Item eventKey="3">
                            <Accordion.Header>
                              <div className="d-flex align-items-center">
                                <BsQuestionCircle className="me-2 text-success" />
                                <span>Quizzes</span>
                                <Badge bg="success" className="ms-2">
                                  {quizzes?.length || 0}
                                </Badge>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              {quizLoading ? (
                                <div className="text-center py-4">
                                  <Spinner animation="border" variant="success" />
                                  <p className="mt-2">A carregar quizzes...</p>
                                </div>
                              ) : !quizzes || quizzes.length === 0 ? (
                                <Alert variant="light" className="text-center">
                                  <BsInfoCircle className="me-2" />
                                  Nenhum quiz disponível para este curso ainda.
                                </Alert>
                              ) : (
                                <ListGroup variant="flush" className="material-list">
                                  {quizzes.map((quiz) => (
                                    <ListGroup.Item key={quiz.quizz_id} className="material-item py-3">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-start">
                                          <div className="me-3 text-success">
                                            <BsQuestionCircle size={24} />
                                          </div>
                                          <div>
                                            <div className="fw-bold">{quiz.descricao}</div>
                                            <div className="mt-2">
                                              <Badge bg="light" text="success" className="me-2">
                                                <BsClock className="me-1" /> Limite: {quiz.limite_tempo} minutos
                                              </Badge>
                                              <Badge bg="light" text="success">
                                                {quiz.questoes_quizzs?.length || 0} questões
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleStartQuiz(quiz.quizz_id)}
                                          >
                                            <BsPlayFill className="me-1" /> Iniciar Quiz
                                          </Button>
                                        </div>
                                      </div>
                                    </ListGroup.Item>
                                  ))}
                                </ListGroup>
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        )}
                      </Accordion>
                    ) : (
                      <Alert variant="light" className="text-center">
                        <BsInfoCircle className="me-2" />
                        Nenhum material disponível para este curso ainda.
                      </Alert>
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

                    {curso?.certificado && (
                      <div className="certification-info mt-4 p-4 bg-primary bg-opacity-10 rounded">
                        <div className="d-flex align-items-center mb-3">
                          <BsTrophy className="me-2 text-primary" size={24} />
                          <h5 className="mb-0">Certificação</h5>
                        </div>
                        <p className="mb-0">
                          Ao completar este curso com sucesso receberá um certificado digital que pode ser adicionado ao seu perfil profissional.
                        </p>
                      </div>
                    )}
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
              {/* Botões de ação */}
              {inscricao === null ? (
                <div className="d-flex justify-content-center mt-4">
                  <Cancelar text={"Cancelar"} onClick={() => navigate("/utilizadores/lista/cursos")} Icon={BsArrowReturnLeft} inline={true} />
                  <Inscrever 
                    text={clicked ? "A inscrever..." : "Inscrever"} 
                    onClick={handleInscricao} 
                    Icon={clicked ? Spinner : FaRegCheckCircle} 
                    disabled={clicked} 
                  />
                </div>
              ) : (
                <div className="text-center mt-4">
                  <Button variant="outline-primary" onClick={() => navigate("/utilizadores/lista/cursos")}>
                    <BsArrowReturnLeft className="me-2" />
                    Voltar aos Cursos
                  </Button>
                </div>
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

          {/* Modal de Avaliação do Formador */}
          <Modal show={showAvaliarFormadorModal} onHide={() => setShowAvaliarFormadorModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Avaliar Formador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-4">Por favor, avalie o desempenho do formador neste curso:</p>

              <div className="d-flex justify-content-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant={avaliacaoFormador >= star ? "warning" : "outline-warning"}
                    onClick={() => setAvaliacaoFormador(star)}
                    className="star-button"
                  >
                    <BsStarFill style={{ color: avaliacaoFormador >= star ? "#f36028" : "#f36028" }} />
                  </Button>
                ))}
              </div>

              {errorAvaliacao && (
                <Alert variant="danger" className="mt-3">
                  {errorAvaliacao}
                </Alert>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAvaliarFormadorModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleAvaliarFormador}>
                Enviar Avaliação
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Quiz Modal */}
          <QuizModal show={showQuizModal} onHide={() => setShowQuizModal(false)} quizId={selectedQuizId} />

          {/* Video Modal */}
          <VideoModal
            show={showVideoModal}
            onHide={() => setShowVideoModal(false)}
            videoUrl={selectedVideo?.url}
            videoTitle={selectedVideo?.title}
          />
        </div>
      </Container>
    </div>
  );
}