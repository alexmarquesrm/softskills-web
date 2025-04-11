import React, { useEffect, useState } from "react";
import axios from "../config/configAxios";
import Card from "../components/cards/cardDestaque"
import DataTable from '../components/tables/dataTable';
import CardPedido from '../components/cards/cardPedido';
import CardRow from '../components/cards/cardRow';
import { Container } from "react-bootstrap";

export default function PaginaGestor() {
  const [nome, setNome] = useState("Rodrigo");
  const [tableRows, setTableRows] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);

  const tableColumns = [
    { field: 'id', headerName: 'Nº Denuncia', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { field: 'denuncia', headerName: 'Denúncia feita por:', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { field: 'motivo', headerName: 'Motivo', flex: 0.7, headerAlign: 'left', disableColumnMenu: false },
    { field: 'descricao', headerName: 'Descrição', flex: 0.7, headerAlign: 'left', disableColumnMenu: true },
    { field: 'data', headerName: 'Data', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
  ];

  const fetchDataDenun = async () => {
    try {
      //const token = sessionStorage.getItem('token');
      const token = "tokenFixo";
      const response = await axios.get(`/denuncia`, {
        headers: { Authorization: `${token}` }
      });
      const denuncia = response.data;
      //console.log(denuncia);
      const sortedDenuncia = denuncia.sort((a, b) => a.denuncia_id - b.denuncia_id);

      setTableRows(
        sortedDenuncia.map((denuncia) => ({
          id: denuncia.denuncia_id,
          descricao: denuncia.descricao,
          //data: denuncia.data,
        }))
      );

    } catch (error) {
      setError(error);
    }
  };

  const fetchDataPedidos = async () => {
    try {
      //const token = sessionStorage.getItem('token');
      const token = "tokenFixo";
      const response = await axios.get(`/pedido`, {
        headers: { Authorization: `${token}` }
      });
      setPedidos(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchDataDenun();
    fetchDataPedidos();
  }, []);

  const renderPedidoCard = (pedido, index) => (
    <CardPedido index={index} pedido={pedido} />
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container className="my-4" style={{ maxWidth: '1720px' }}>
      <h3>Visao geral</h3>
      <h6>Bem-vindo, {nome}</h6>
      <Card />
      <br></br>
      <h3>Pedidos</h3>

      <Container className="my-4" style={{ maxWidth: '1720px' }}>
        <CardRow dados={pedidos} renderCard={renderPedidoCard} scrollable={true} /*colSize={4}*/ />
      </Container>

      <br></br>
      <h3>Denúncias</h3>
      <DataTable rows={tableRows || []} columns={tableColumns} />
    </Container>
  );
}

