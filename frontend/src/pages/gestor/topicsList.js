import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { IoIosBook, IoIosAdd } from "react-icons/io";
import axios from "../../config/configAxios";
import DataTable from "../../components/tables/dataTable";
import TopicModal from "../../modals/gestor/topicModal";
import "./topicsList.css";

export default function TopicsList() {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    areasWithTopics: 0,
    categoriesWithTopics: 0
  });

  const tableColumns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      align: 'left', 
      headerAlign: 'left', 
      width: '80px',
      renderCell: ({ row }) => (
        <span className="text-muted">#{row.id}</span>
      )
    },
    { 
      field: 'descricao', 
      headerName: 'Descrição', 
      align: 'left', 
      headerAlign: 'left', 
      minWidth: '200px',
      renderCell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
            <IoIosBook className="text-primary" size={18} />
          </div>
          <span className="text-primary fw-medium">{row.descricao}</span>
        </div>
      )
    },
    {
      field: 'area', 
      headerName: 'Área', 
      align: 'left', 
      headerAlign: 'left', 
      minWidth: '180px',
      renderCell: ({ row }) => (
        <span className="text-muted">{row.area}</span>
      )
    },
    {
      field: 'categoria', 
      headerName: 'Categoria', 
      align: 'left', 
      headerAlign: 'left', 
      minWidth: '180px',
      renderCell: ({ row }) => (
        <span className="text-muted">{row.categoria}</span>
      )
    },
    {
      field: 'actions', 
      headerName: 'Ações', 
      align: 'center', 
      headerAlign: 'center', 
      sortable: false, 
      width: '120px',
      renderCell: ({ row }) => (
        <div className="d-flex justify-content-center gap-2">
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(row)}
          >
            Editar
          </button>
        </div>
      )
    }
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get("/categoria");
      const categories = response.data;
      // Calculate stats and collect topics
      const topics = [];
      const areasWithTopics = new Set();
      const categoriesWithTopics = new Set();

      categories.forEach(category => {
        if (category.categoria_areas) {
          category.categoria_areas.forEach(area => {
            if (area.area_topicos) {
              area.area_topicos.forEach(topic => {
                const topicData = {
                  topico_id: topic.topico_id,
                  descricao: topic.descricao,
                  area: area.descricao,
                  categoria: category.descricao,
                  area_id: area.area_id
                };
                topics.push(topicData);
                areasWithTopics.add(area.area_id);
                categoriesWithTopics.add(category.categoria_id);
              });
            }
          });
        }
      });

      setStats({
        total: topics.length,
        areasWithTopics: areasWithTopics.size,
        categoriesWithTopics: categoriesWithTopics.size
      });

      // Format data for table
      setTableRows(topics.map(topic => ({
        id: topic.topico_id,
        descricao: topic.descricao,
        area: topic.area,
        categoria: topic.categoria,
        area_id: topic.area_id
      })));

      setError(null);
    } catch (err) {
      console.error("Erro ao carregar tópicos:", err);
      setError("Não foi possível carregar os tópicos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (topic) => {
    // Fetch the complete topic data from the API
    const fetchTopicData = async () => {
      try {
        const response = await axios.get(`/topico/${topic.id}`);
        setSelectedTopic({
          topico_id: response.data.topico_id,
          descricao: response.data.descricao,
          area_id: response.data.area_id
        });
        setShowModal(true);
      } catch (err) {
        console.error("Erro ao buscar dados do tópico:", err);
        setError("Erro ao carregar dados do tópico. Tente novamente.");
      }
    };

    fetchTopicData();
  };

  const handleAddClick = () => {
    setSelectedTopic(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTopic(null);
  };

  const handleModalSuccess = (message) => {
    setSuccessMessage(message);
    fetchData();
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">A carregar...</span>
        </Spinner>
        <p>A carregar tópicos...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Lista de Tópicos</h3>
      </div>

      {successMessage && (
        <Alert variant="success" className="mb-4" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 bg-light h-100 shadow-sm hover-shadow">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle p-3 me-3">
                  <IoIosBook className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Total de Tópicos</h6>
                  <h4 className="mb-0 fw-bold">{stats.total}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 bg-light h-100 shadow-sm hover-shadow">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-info rounded-circle p-3 me-3">
                  <IoIosBook className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Áreas com Tópicos</h6>
                  <h4 className="mb-0 fw-bold">{stats.areasWithTopics}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 bg-light h-100 shadow-sm hover-shadow">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-success rounded-circle p-3 me-3">
                  <IoIosBook className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Categorias com Tópicos</h6>
                  <h4 className="mb-0 fw-bold">{stats.categoriesWithTopics}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error ? (
        <Alert variant="danger">
          {error}
        </Alert>
      ) : (
        <DataTable 
          columns={tableColumns} 
          rows={tableRows} 
          title=" " 
          showSearch={true} 
          pageSize={10} 
          emptyStateMessage="Nenhum tópico encontrado"
        />
      )}

      {/* Floating Action Button */}
      <button className="floating-add-button" onClick={handleAddClick} title="Adicionar Tópico">
        <IoIosAdd size={24} />
      </button>

      <TopicModal
        show={showModal}
        handleClose={handleModalClose}
        topic={selectedTopic}
        onSuccess={handleModalSuccess}
      />
    </Container>
  );
} 