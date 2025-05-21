import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { IoIosBook, IoIosAdd } from "react-icons/io";
import axios from "../../config/configAxios";
import DataTable from "../../components/tables/dataTable";
import CategoryModal from "../../modals/gestor/categoryModal";
import "./categoriesList.css";

export default function CategoriesList() {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    activeAreas: 0,
    totalTopics: 0
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
      field: 'areas', 
      headerName: 'Áreas', 
      align: 'center', 
      headerAlign: 'center', 
      width: '120px',
      renderCell: ({ row }) => (
        <span className="badge bg-info text-white">
          {row.areas || 0}
        </span>
      )
    },
    {
      field: 'topicos', 
      headerName: 'Tópicos', 
      align: 'center', 
      headerAlign: 'center', 
      width: '120px',
      renderCell: ({ row }) => (
        <span className="badge bg-success text-white">
          {row.topicos || 0}
        </span>
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

      // Calculate stats
      const totalAreas = categories.reduce((acc, cat) => acc + (cat.categoria_areas?.length || 0), 0);
      const totalTopics = categories.reduce((acc, cat) => {
        const topicsInAreas = cat.categoria_areas?.reduce((areaAcc, area) => 
          areaAcc + (area.area_topicos?.length || 0), 0) || 0;
        return acc + topicsInAreas;
      }, 0);

      setStats({
        total: categories.length,
        activeAreas: totalAreas,
        totalTopics: totalTopics
      });

      // Format data for table
      setTableRows(categories.map(category => ({
        id: category.categoria_id,
        descricao: category.descricao,
        areas: category.categoria_areas?.length || 0,
        topicos: category.categoria_areas?.reduce((acc, area) => 
          acc + (area.area_topicos?.length || 0), 0) || 0
      })));

      setError(null);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
      setError("Não foi possível carregar as categorias. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (category) => {
    setSelectedCategory({
      categoria_id: category.id,
      descricao: category.descricao
    });
    setShowModal(true);
  };

  const handleAddClick = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCategory(null);
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
        <p>A carregar categorias...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Lista de Categorias</h3>
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
                  <h6 className="mb-1 text-muted">Total de Categorias</h6>
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
                  <h6 className="mb-1 text-muted">Áreas Ativas</h6>
                  <h4 className="mb-0 fw-bold">{stats.activeAreas}</h4>
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
                  <h6 className="mb-1 text-muted">Total de Tópicos</h6>
                  <h4 className="mb-0 fw-bold">{stats.totalTopics}</h4>
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
          emptyStateMessage="Nenhuma categoria encontrada"
        />
      )}

      {/* Floating Action Button */}
      <button className="floating-add-button" onClick={handleAddClick} title="Adicionar Categoria">
        <IoIosAdd size={24} />
      </button>

      <CategoryModal
        show={showModal}
        handleClose={handleModalClose}
        category={selectedCategory}
        onSuccess={handleModalSuccess}
      />
    </Container>
  );
} 