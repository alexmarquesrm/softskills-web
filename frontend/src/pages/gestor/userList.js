import React, { useState, useEffect } from "react";
import axios from "../../config/configAxios";
/* COMPONENTES */
import Alert from '../components/alerts/alert';
import DataTable from '../../components/tables/dataTable';
import EditButton from "../../components/buttons/editButton";
import AddButton from '../../components/buttons/addButton';
import SearchBar from '../../components/searchBar/searchBar';
/* MODALS */
import ModalEditarUtilizador from '../modals/EditUser';
import NovoUser from '../../modals/gestor/addUser';
import EditUser from '../../modals/gestor/editUser';
/* ICONS */
import { FaPencilAlt } from "react-icons/fa";

export default function UsersTable() {
  const [isNewModalOpen, setNewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroText, setFiltroText] = useState('');
  const [tableRows, setTableRows] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const tableColumns = [
    { field: 'id', headerName: 'Nº Colaborador', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { field: 'nome', headerName: 'Nome', flex: 0.7, headerAlign: 'left', disableColumnMenu: false },
    { field: 'email', headerName: 'Email', flex: 1, headerAlign: 'left', disableColumnMenu: true },
    { field: 'telefone', headerName: 'Telefone', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { field: 'departamento', headerName: 'Departamento', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { field: 'funcao', headerName: 'Função', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    {
      field: 'status', headerName: ' ', flex: 0.5, headerAlign: 'left', sortable: false, renderCell: (params) => (<div style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}> <EditButton onClick={() => handleEditClick(params.row)} Icon={FaPencilAlt} /> </div>), disableColumnMenu: true
    },
  ]; const handleEditClick = (userData) => {
    setSelectedUser(userData);
    setShowModal(true);
  };

  const handleSave = (userData) => {

    console.log("Salvando usuário:", userData);
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

  return (
    <div className="data-container">
      <div style={{ marginBottom: '20px', paddingTop: '20px' }}>
        <AddButton text='Adicionar' onClick={() => setNewModalOpen(true)} />
        <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} handleSearchClick={handleSearchClick} />
        {/* <ComboFilter options={opcoesFiltro} value={filtroCombo} handleChange={(e) => setFiltroCombo(e.target.value)} /> */}
      </div>
      <div style={{ width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
        <DataTable rows={tableRows || []} columns={tableColumns} />
      </div>

      <NovoUser open={isNewModalOpen} onClose={() => setNewModalOpen(false)} />
      <ModalEditarUtilizador show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={selectedUser || {}} />
    </div>
  );
}