import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { IoIosBook, IoIosAdd } from "react-icons/io";
import { MessageSquare } from 'react-feather';
import axios from "../../config/configAxios";
/* COMPONENTES */
import DataTable from "../../components/tables/dataTable";
/* MODALS */
import AreaModal from "../../modals/gestor/areaModal";
/* CSS */
import "./areasList.css";

export default function AreasList() {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    totalTopics: 0,
    categoriesWithAreas: 0
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
      const areas = categories.reduce((acc, cat) => {
        if (cat.categoria_areas) {
          cat.categoria_areas.forEach(area => {
            acc.push({
              ...area,
              categoria: cat.descricao
            });
          });
        }
        return acc;
      }, []);

      const totalTopics = areas.reduce((acc, area) =>
        acc + (area.area_topicos?.length || 0), 0);

      setStats({
        total: areas.length,
        totalTopics: totalTopics,
        categoriesWithAreas: categories.filter(cat => cat.categoria_areas?.length > 0).length
      });

      // Format data for table
      setTableRows(areas.map(area => ({
        id: area.area_id,
        descricao: area.descricao,
        categoria: area.categoria,
        topicos: area.area_topicos?.length || 0
      })));

      setError(null);
    } catch (err) {
      console.error("Erro ao carregar áreas:", err);
      setError("Não foi possível carregar as áreas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (area) => {
    // Fetch the complete area data from the API
    const fetchAreaData = async () => {
      try {
        const response = await axios.get(`/area/${area.id}`);
        setSelectedArea({
          area_id: response.data.area_id,
          descricao: response.data.descricao,
          categoria_id: response.data.categoria_id
        });
        setShowModal(true);
      } catch (err) {
        console.error("Erro ao buscar dados da área:", err);
        setError("Erro ao carregar dados da área. Tente novamente.");
      }
    };

    fetchAreaData();
  };

  const handleAddClick = () => {
    setSelectedArea(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
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
        <p>A carregar áreas...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="forum-header">
        <div className="forum-header-content">
          <div className="forum-header-icon">
            <MessageSquare size={32} />
          </div>
          <div className="forum-header-info">
            <h1>Lista de Áreas</h1>
          </div>
        </div>
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
                  <h6 className="mb-1 text-muted">Total de Áreas</h6>
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
                  <h6 className="mb-1 text-muted">Categorias com Áreas</h6>
                  <h4 className="mb-0 fw-bold">{stats.categoriesWithAreas}</h4>
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
          emptyStateMessage="Nenhuma área encontrada"
        />
      )}

      {/* Floating Action Button */}
      <button className="floating-add-button" onClick={handleAddClick} title="Adicionar Área">
        <IoIosAdd size={24} />
      </button>

      <AreaModal
        show={showModal}
        handleClose={handleModalClose}
        area={selectedArea}
        onSuccess={handleModalSuccess}
      />
    </Container>
  );
} 