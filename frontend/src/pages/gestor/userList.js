import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "../../config/configAxios";
/* COMPONENTES */
import DataTable from '../../components/tables/dataTable';
import EditButton from "../../components/buttons/editButton";
import AddButton from '../../components/buttons/addButton';
import SearchBar from '../../components/textFields/search';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [tableRows, setTableRows] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const navigate = useNavigate();

  const tableColumns = [
    { field: 'id', headerName: 'Nº Colaborador', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { field: 'nome', headerName: 'Nome', flex: 0.7, headerAlign: 'left', disableColumnMenu: false, renderCell: (params) => ( 
      <span onClick={() => navigate('/gestor/colaborador/percursoFormativo', { state: { id: params.row.id } })}
      style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }} > {params.row.nome}  </span> ),},
    { field: 'email', headerName: 'Email', flex: 1, headerAlign: 'left', disableColumnMenu: true },
    { field: 'telefone', headerName: 'Telefone', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { field: 'departamento', headerName: 'Departamento', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { field: 'funcao', headerName: 'Função', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    {field: 'percurso', headerName: '', flex: 0.3, headerAlign: 'left', sortable: false, renderCell: (params) => (<div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%',
    }}> <EditButton onClick={() => handleEditClick(params.row)} Icon={PiStudentBold} /> </div>), disableColumnMenu: true
  },
    {field: 'status', headerName: ' ', flex: 0.3, headerAlign: 'left', sortable: false, renderCell: (params) => (<div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%',
      }}> <EditButton onClick={() => handleEditClick(params.row)} Icon={FaPencilAlt} /> </div>), disableColumnMenu: true
    },
  ];
  
  const handleEditClick = (userData) => {
    setSelectedUser(userData);
    setShowModal(true);
  };

  const handleSave = (userData) => {
    setShowModal(false);
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
          key: colaborador.colaborador_id,
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    console.log('Termo de pesquisa:', searchTerm);
  };

  const filteredRows = tableRows.filter((row) =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h3>Lista de Colaboradores</h3>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
        <div>
          <AddButton text='Adicionar Colaborador' onClick={() => setNewModalOpen(true)} Icon={IoMdAddCircleOutline} inline />
        </div>
        <div className="flex-grow-1">
          <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} handleSearchClick={handleSearchClick} />
        </div>
      </div>
      <DataTable rows={filteredRows || []} columns={tableColumns} />

      <NovoUser show={isNewModalOpen} onClose={() => setNewModalOpen(false)} />
      <EditUser show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={selectedUser || {}} />
    </div>
  );
}