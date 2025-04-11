import React, { useState, useEffect } from "react";
import axios from "../config/configAxios";
import DataTable from '../components/tables/dataTable';
import EditButton from "../components/buttons/editButton";
import { FaPencilAlt } from "react-icons/fa";

export default function UsersTable() {
  const [tableRows, setTableRows] = useState([]);
  const [error, setError] = useState(null);

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
      }}> <EditButton onClick={() => alert(`Editar ${params.row.nome}`)} Icon={FaPencilAlt} /> </div>), disableColumnMenu: true
    },
  ];

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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="data-container">
      <div style={{ width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
        <DataTable rows={tableRows || []} columns={tableColumns} />
      </div>
    </div>
  );
}