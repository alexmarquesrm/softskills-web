import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "../../config/configAxios";
import { MessageSquare } from 'react-feather';
/* COMPONENTES */
import DataTable from '../../components/tables/dataTable';
/* MODALS */
import NovoUser from '../../modals/gestor/addUser';
import EditUser from '../../modals/gestor/editUser';
/* ICONS */
import { FaPencilAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { PiStudentBold } from "react-icons/pi";
import { BsFillPeopleFill, BsBuilding, BsBriefcase, BsEnvelope } from "react-icons/bs";
import { Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import './userList.css';

export default function UsersTable() {
  const [isNewModalOpen, setNewModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    departamentos: 0,
    funcoes: 0,
    ativos: 0
  });

  const navigate = useNavigate();

  const tableColumns = [
    {
      field: 'id',
      headerName: 'Nº Colaborador',
      align: 'left',
      headerAlign: 'left',
      width: '120px',
      renderCell: ({ row }) => (
        <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">
          #{row.id}
        </Badge>
      )
    },
    {
      field: 'nome',
      headerName: 'Nome',
      align: 'left',
      headerAlign: 'left',
      minWidth: '200px',
      renderCell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
            <BsFillPeopleFill className="text-primary" size={18} />
          </div>
          <span
            onClick={() => navigate('/gestor/colaborador/percursoFormativo', { state: { id: row.id } })}
            className="text-primary fw-medium cursor-pointer hover-underline"
            style={{ cursor: 'pointer' }}
          >
            {row.nome}
          </span>
        </div>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      align: 'left',
      headerAlign: 'left',
      minWidth: '240px',
      renderCell: ({ row }) => (
        <div className="d-flex align-items-center">
          <BsEnvelope className="text-muted me-2" size={16} />
          <span className="text-muted">{row.email}</span>
        </div>
      )
    },
    {
      field: 'funcao',
      headerName: 'Função',
      align: 'left',
      headerAlign: 'left',
      minWidth: '180px',
      renderCell: ({ row }) => (
        <div className="d-flex align-items-center">
          <BsBriefcase className="text-muted me-2" size={16} />
          <span className="text-muted">{row.funcao || 'Não definido'}</span>
        </div>
      )
    },
    {
      field: 'percurso',
      headerName: 'Percurso',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      width: '120px',
      renderCell: ({ row }) => (
        <button
          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 mx-auto"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/gestor/colaborador/percursoFormativo', { state: { id: row.id } });
          }}
        >
          <PiStudentBold size={16} />
          <span className="d-none d-lg-inline">Percurso</span>
        </button>
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
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(row);
            }}
          >
            <FaPencilAlt size={14} />
            <span className="d-none d-lg-inline">Editar</span>
          </button>
        </div>
      )
    },
  ];

  const handleEditClick = (userData) => {
    setSelectedUser(userData);
    setShowModal(true);
  };

  const handleSave = (userData) => {
    setShowModal(false);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError(new Error('No authentication token found'));
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get(`/colaborador`, {
        headers: { Authorization: `${token}` }
      });
      const utilizadores = response.data;
      const sortedUtilizadores = utilizadores.sort((a, b) => a.colaborador_id - b.colaborador_id);

      // Fetch department and function data for each user
      const utilizadoresCompletos = await Promise.all(
        sortedUtilizadores.map(async (colaborador) => {
          let departamentoNome = "Não definido";
          let funcaoNome = "Não definido";

          if (colaborador.funcao_id) {
            try {
              const funcaoResponse = await axios.get(`/funcao/${colaborador.funcao_id}`);
              if (funcaoResponse.data) {
                funcaoNome = funcaoResponse.data.nome;

                const departamentoResponse = await axios.get(`/departamento/${funcaoResponse.data.departamento_id}`);
                if (departamentoResponse.data) {
                  departamentoNome = departamentoResponse.data.nome;
                }
              }
            } catch (error) {
              console.error("Erro a procurar dados de departamento/função:", error);
            }
          }

          return {
            ...colaborador,
            departamento: departamentoNome,
            funcao: funcaoNome
          };
        })
      );

      // Calculate statistics
      const departamentos = new Set(utilizadoresCompletos.map(u => u.departamento).filter(Boolean));
      const funcoes = new Set(utilizadoresCompletos.map(u => u.funcao).filter(Boolean));
      const loggedUserId = Number(sessionStorage.getItem('colaboradorid'));

      setStats({
        total: utilizadoresCompletos.length,
        departamentos: departamentos.size,
        funcoes: funcoes.size,
        ativos: utilizadoresCompletos.filter(u => !u.inativo).length
      });

      setTableRows(
        utilizadoresCompletos.filter(u => u.colaborador_id !== loggedUserId).map((colaborador) => ({
          id: colaborador.colaborador_id,
          nome: colaborador.nome,
          departamento: colaborador.departamento,
          funcao: colaborador.funcao,
          email: colaborador.email,
          inativo: colaborador.inativo
        }))
      );

    } catch (error) {
      setError(error);
      console.error("Erro ao procurar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isNewModalOpen) {
      fetchData();
    }
  }, [isNewModalOpen]);

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">A carregar...</span>
        </Spinner>
        <p>A carregar informação...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="forum-header">
        <div className="forum-header-content">
          <div className="forum-header-icon">
            <MessageSquare size={32} />
          </div>
          <div className="forum-header-info">
            <h1>Lista de colaboradores</h1>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 bg-light h-100 shadow-sm hover-shadow">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle p-3 me-3">
                  <BsFillPeopleFill className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Total de Colaboradores</h6>
                  <h4 className="mb-0 fw-bold">{stats.total}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-light h-100 shadow-sm hover-shadow">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-success rounded-circle p-3 me-3">
                  <BsBuilding className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Departamentos</h6>
                  <h4 className="mb-0 fw-bold">{stats.departamentos}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-light h-100 shadow-sm hover-shadow">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-info rounded-circle p-3 me-3">
                  <BsBriefcase className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Funções</h6>
                  <h4 className="mb-0 fw-bold">{stats.funcoes}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-light h-100 shadow-sm hover-shadow">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-warning rounded-circle p-3 me-3">
                  <BsFillPeopleFill className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-1 text-muted">Colaboradores Ativos</h6>
                  <h4 className="mb-0 fw-bold">{stats.ativos}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && error.response && error.response.status === 403 ? (
        <Alert variant="danger">
          Sem permissão para visualizar a lista de colaboradores.
        </Alert>
      ) : error ? (
        <Alert variant="danger">
          Erro ao carregar dados: {error.message}
        </Alert>
      ) : (
        <DataTable
          columns={tableColumns}
          rows={tableRows || []}
          title=" "
          showSearch={true}
          showAddButton={false}
          pageSize={10}
          emptyStateMessage="Nenhum colaborador encontrado"
        />
      )}

      <NovoUser show={isNewModalOpen} onClose={() => setNewModalOpen(false)} />
      <EditUser show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={selectedUser || {}} />

      {/* Floating Action Button */}
      <button className="floating-add-button" onClick={() => setNewModalOpen(true)} title="Adicionar Colaborador">
        <IoMdAdd size={24} />
      </button>
    </div>
  );
}