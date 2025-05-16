import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "../../config/configAxios";
/* COMPONENTES */
import DataTable from '../../components/tables/dataTable';
import AddButton from '../../components/buttons/addButton';
/* MODALS */
import NovoUser from '../../modals/gestor/addUser';
import EditUser from '../../modals/gestor/editUser';
/* ICONS */
import { FaPencilAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { PiStudentBold } from "react-icons/pi";
import { BsFillPeopleFill, BsBuilding, BsBriefcase, BsEnvelope } from "react-icons/bs";
import { Card, Row, Col, Badge } from 'react-bootstrap';

export default function UsersTable() {
  const [isNewModalOpen, setNewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
      width: '100px',
      renderCell: ({ row }) => (
        <Badge bg="light" text="dark" className="px-2 py-1">
          #{row.id}
        </Badge>
      )
    }, 
    { 
      field: 'nome', 
      headerName: 'Nome', 
      align: 'left', 
      headerAlign: 'left', 
      minWidth: '180px', 
      renderCell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="bg-light rounded-circle p-2 me-2">
            <BsFillPeopleFill className="text-primary" size={16} />
          </div>
          <span 
            onClick={() => navigate('/gestor/colaborador/percursoFormativo', { state: { id: row.id } })}
            style={{ color: '#3182ce', cursor: 'pointer', fontWeight: 500 }}
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
      minWidth: '220px',
      renderCell: ({ row }) => (
        <div className="d-flex align-items-center">
          <BsEnvelope className="text-muted me-2" />
          {row.email}
        </div>
      )
    },
    {
      field: 'departamento', 
      headerName: 'Departamento', 
      align: 'left', 
      headerAlign: 'left', 
      minWidth: '160px',
      renderCell: ({ row }) => (
        <div className="d-flex align-items-center">
          <BsBuilding className="text-muted me-2" />
          {row.departamento}
        </div>
      )
    },
    {
      field: 'funcao', 
      headerName: 'Função', 
      align: 'left', 
      headerAlign: 'left', 
      minWidth: '160px',
      renderCell: ({ row }) => (
        <div className="d-flex align-items-center">
          <BsBriefcase className="text-muted me-2" />
          {row.funcao}
        </div>
      )
    },
    {
      field: 'percurso', 
      headerName: 'Percurso', 
      align: 'left', 
      headerAlign: 'left', 
      sortable: false, 
      width: '100px',
      renderCell: ({ row }) => (
        <button 
          className="btn btn-sm btn-outline-info d-flex align-items-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/gestor/colaborador/percursoFormativo', { state: { id: row.id } });
          }}
        >
          <PiStudentBold className="me-1" />
          <span className="d-none d-lg-inline">Percurso</span>
        </button>
      )
    },
    {
      field: 'actions', 
      headerName: 'Ações', 
      align: 'left', 
      headerAlign: 'left', 
      sortable: false, 
      width: '120px',
      renderCell: ({ row }) => (
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-outline-primary d-flex align-items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(row);
            }}
          >
            <FaPencilAlt className="me-1" />
            <span className="d-none d-lg-inline">Editar</span>
          </button>
          <Badge bg={row.inativo ? "danger" : "success"} className="d-flex align-items-center">
            {row.inativo ? "Inativo" : "Ativo"}
          </Badge>
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
      console.log(utilizadores);
      const sortedUtilizadores = utilizadores.sort((a, b) => a.colaborador_id - b.colaborador_id);

      // Calcular estatísticas
      const departamentos = new Set(utilizadores.map(u => u.departamento));
      const funcoes = new Set(utilizadores.map(u => u.cargo));
      
      setStats({
        total: utilizadores.length,
        departamentos: departamentos.size,
        funcoes: funcoes.size,
        ativos: utilizadores.filter(u => !u.inativo).length
      });

      setTableRows(
        sortedUtilizadores.map((colaborador) => ({
          id: colaborador.colaborador_id,
          nome: colaborador.nome,
          departamento: colaborador.departamento,
          funcao: colaborador.cargo,
          email: colaborador.email,
          inativo: colaborador.inativo
        }))
      );

    } catch (error) {
      setError(error);
      console.error("Erro ao procurar dados:", error);
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Lista de Colaboradores</h3>
      </div>

      {/* Cards de Estatísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 bg-light h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle p-3 me-3">
                  <BsFillPeopleFill className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-0">Total de Colaboradores</h6>
                  <h4 className="mb-0">{stats.total}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-light h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-success rounded-circle p-3 me-3">
                  <BsBuilding className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-0">Departamentos</h6>
                  <h4 className="mb-0">{stats.departamentos}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-light h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-info rounded-circle p-3 me-3">
                  <BsBriefcase className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-0">Funções</h6>
                  <h4 className="mb-0">{stats.funcoes}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-light h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-warning rounded-circle p-3 me-3">
                  <BsFillPeopleFill className="text-white" size={24} />
                </div>
                <div>
                  <h6 className="mb-0">Colaboradores Ativos</h6>
                  <h4 className="mb-0">{stats.ativos}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {error && error.response && error.response.status === 403 ? (
        <div className="alert alert-danger">
          Sem permissão para visualizar a lista de colaboradores.
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          Erro ao carregar dados: {error.message}
        </div>
      ) : (
        <DataTable 
          columns={tableColumns} 
          rows={tableRows || []} 
          title=" " 
          showSearch={true} 
          pageSize={10} 
          emptyStateMessage="Nenhum colaborador encontrado"
          addButton={
            <AddButton 
              text="Adicionar Colaborador" 
              onClick={() => setNewModalOpen(true)} 
              Icon={IoMdAddCircleOutline} 
              inline 
            />
          }
        />
      )}
  
      <NovoUser show={isNewModalOpen} onClose={() => setNewModalOpen(false)} />
      <EditUser show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={selectedUser || {}} />
    </div>
  );
}