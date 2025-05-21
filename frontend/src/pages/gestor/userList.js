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
import './userList.css';

export default function UsersTable() {
  const [isNewModalOpen, setNewModalOpen] = useState(false);
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
      field: 'departamento', 
      headerName: 'Departamento', 
      align: 'left', 
      headerAlign: 'left', 
      minWidth: '180px',
      renderCell: ({ row }) => (
        <div className="d-flex align-items-center">
          <BsBuilding className="text-muted me-2" size={16} />
          <span className="text-muted">{row.departamento || 'Não definido'}</span>
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
      console.log('Dados recebidos da API:', utilizadores);
      const sortedUtilizadores = utilizadores.sort((a, b) => a.colaborador_id - b.colaborador_id);

      // dados de departamento e função para cada usuário
      const utilizadoresCompletos = await Promise.all(
        sortedUtilizadores.map(async (colaborador) => {
          let departamentoNome = "Não definido";
          let funcaoNome = "Não definido";

          if (colaborador.funcao_id) {
            try {
              // dados da função
              const funcaoResponse = await axios.get(`/funcao/${colaborador.funcao_id}`);
              if (funcaoResponse.data) {
                funcaoNome = funcaoResponse.data.nome;
                
                // dados do departamento
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

      // Calcular estatísticas
      const departamentos = new Set(utilizadoresCompletos.map(u => u.departamento).filter(Boolean));
      const funcoes = new Set(utilizadoresCompletos.map(u => u.funcao).filter(Boolean));
      
      setStats({
        total: utilizadoresCompletos.length,
        departamentos: departamentos.size,
        funcoes: funcoes.size,
        ativos: utilizadoresCompletos.filter(u => !u.inativo).length
      });

      setTableRows(
        utilizadoresCompletos.map((colaborador) => ({
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
        <h3 className="mb-0">Lista de Colaboradores</h3>
      </div>

      {/* Cards de Estatísticas */}
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