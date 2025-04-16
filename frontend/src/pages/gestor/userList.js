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

export default function UsersTable() {
  const [isNewModalOpen, setNewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const navigate = useNavigate();

  const tableColumns = [
    { field: 'id', headerName: 'Nº Colaborador', align: 'left', headerAlign: 'left', width: '120px'}, { 
      field: 'nome', headerName: 'Nome', align: 'left', headerAlign: 'left', minWidth: '180px', renderCell: ({ row }) => ( 
        <span onClick={() => navigate('/gestor/colaborador/percursoFormativo', { state: { id: row.id } })}
          style={{ color: '#3182ce', cursor: 'pointer', fontWeight: 500 }} >
          {row.nome}
        </span>
      )
    },
    { field: 'email', headerName: 'Email', align: 'left', headerAlign: 'left', minWidth: '220px' },
    { field: 'telefone', headerName: 'Telefone', align: 'left', headerAlign: 'left', width: '150px' 
    },
    { field: 'departamento', headerName: 'Departamento', align: 'left', headerAlign: 'left', minWidth: '160px'
    },
    { field: 'funcao', headerName: 'Função', align: 'left', headerAlign: 'left', minWidth: '160px'
    },
    { field: 'percurso', headerName: 'Percurso', align: 'left', headerAlign: 'left', sortable: false, width: '100px', 
      renderCell: ({ row }) => (
        <div style={{ textAlign: 'left' }}>
          <button className="btn btn-sm btn-outline-info" 
            onClick={(e) => {
              e.stopPropagation();
              navigate('/gestor/colaborador/percursoFormativo', { state: { id: row.id } });
            }} >
            <PiStudentBold className="me-1" />
            <span className="d-none d-lg-inline">Percurso</span>
          </button>
        </div>
      )
    },
    { field: 'actions', headerName: 'Ações', align: 'left', headerAlign: 'left', sortable: false, width: '100px', 
      renderCell: ({ row }) => (
        <div style={{ textAlign: 'left' }}>
          <button className="btn btn-sm btn-outline-primary" 
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(row);
            }} >
            <FaPencilAlt className="me-1" />
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

      const response = await axios.get(`/colaborador`, {
        headers: { Authorization: `${token}` }
      });
      const utilizadores = response.data;
      const sortedUtilizadores = utilizadores.sort((a, b) => a.colaborador_id - b.colaborador_id);

      setTableRows(
        sortedUtilizadores.map((colaborador) => ({
          id: colaborador.colaborador_id,
          nome: colaborador.nome,
          departamento: colaborador.departamento,
          funcao: colaborador.cargo,
          email: colaborador.email,
          telefone: colaborador.telefone,
        }))
      );

    } catch (error) {
      setError(error);
      console.error("Erro ao buscar dados:", error);
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
      <div className="mb-4">
        <h3>Lista de Colaboradores</h3>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
        <div>
          <AddButton text='Adicionar Colaborador' onClick={() => setNewModalOpen(true)} Icon={IoMdAddCircleOutline} inline />
        </div>
      </div>
      
      <DataTable columns={tableColumns} rows={tableRows || []} title="Colaboradores" showSearch={true} pageSize={10} emptyStateMessage="Nenhum colaborador encontrado" />

      <NovoUser show={isNewModalOpen} onClose={() => setNewModalOpen(false)} />
      
      <EditUser show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={selectedUser || {}} />
    </div>
  );
}