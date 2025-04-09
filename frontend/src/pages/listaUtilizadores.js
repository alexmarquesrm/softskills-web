import React, { useState, useEffect } from "react";
import axios from "../config/configAxios";
import DataTable from '../components/tables/dataTable';

export default function UsersTable() {
  const [tableRows, setTableRows] = useState([]);
  const [error, setError] = useState(null);

  const tableColumns = [
    { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left', disableColumnMenu: true },
    { field: 'nome', headerName: 'Nome', flex: 1, headerAlign: 'left', disableColumnMenu: true },
    { field: 'email', headerName: 'Email', flex: 1, headerAlign: 'left', disableColumnMenu: true },
    { field: 'telefone', headerName: 'Telefone', flex: 0.7, headerAlign: 'left', disableColumnMenu: true },
    { field: 'departamento', headerName: 'Departamento', flex: 0.7, headerAlign: 'left', disableColumnMenu: true },
    { field: 'funcao', headerName: 'Função', flex: 1, headerAlign: 'left', disableColumnMenu: true },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(`/colaborador`);
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
    <div className="page-container">
      <div className="data-container">
        <div style={{width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
          <DataTable rows={tableRows || []} columns={tableColumns} />
        </div>
      </div>
    </div>
  );
}