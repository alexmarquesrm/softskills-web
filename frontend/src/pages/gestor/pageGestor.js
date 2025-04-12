import React, { useEffect, useState } from "react";
import axios from "../../config/configAxios";
import Card from "../../components/cards/cardDestaque"
import DataTable from '../../components/tables/dataTable';
import CardPedido from '../../components/cards/cardPedido';
import CardRow from '../../components/cards/cardRow';
import { Container } from "react-bootstrap";

export default function PaginaGestor() {
  const formatDate = (date) => {
    const data = new Date(date);
    const agora = new Date();
    const diffMs = agora - data;
    const diffHoras = diffMs / (1000 * 60 * 60);
    const diffDias = Math.floor(diffHoras / 24);
    const diffMeses = Math.floor(diffDias / 30);
  
    if (diffHoras < 24) {
      const horas = Math.floor(diffHoras);
      return `${horas} hora${horas !== 1 ? 's' : ''} atrás`;
    } else if (diffDias < 30) {
      return `${diffDias} dia${diffDias !== 1 ? 's' : ''} atrás`;
    } else if (diffMeses <= 3) {
      return `${diffMeses} mês${diffMeses !== 1 ? 'es' : ''} atrás`;
    } else {
      return "há mais de 3 meses";
    }
  };

  const [tableRows, setTableRows] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const nome = sessionStorage.getItem('nome');

  const tableColumns = [
    { field: 'id', headerName: 'Nº Denuncia', flex: 0.3, headerAlign: 'left', disableColumnMenu: true },
    { field: 'denuncia', headerName: 'Denúncia feita por:', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { field: 'motivo', headerName: 'Motivo', flex: 0.4, headerAlign: 'left', disableColumnMenu: false },
    { field: 'descricao', headerName: 'Descrição', flex: 0.8, headerAlign: 'left', disableColumnMenu: true },
    { field: 'data', headerName: 'Data', flex: 0.3, headerAlign: 'left', disableColumnMenu: true },
  ];

  const fetchDataDenun = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`/denuncia`, {
        headers: { Authorization: `${token}` }
      });
      const denuncia = response.data;
      const sortedDenuncia = denuncia.sort((a, b) => new Date(b.data) - new Date(a.data));

      setTableRows(
        sortedDenuncia.map((denuncia) => {
          let motivoTexto;
          switch (denuncia.motivo) {
            case 'S':
              motivoTexto = 'Spam';
              break;
            case 'I':
              motivoTexto = 'Inapropriado';
              break;
            default:
              motivoTexto = 'Outros';
          }

          return {
            id: denuncia.denuncia_id,
            denuncia: denuncia.formando.formando_colab.nome,
            motivo: motivoTexto,
            descricao: denuncia.descricao,
            data: formatDate(denuncia.data),
          };
        })
      );

    } catch (error) {
      setError(error);
    }
  };

  const fetchDataPedidos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`/pedido`, {
        headers: { Authorization: `${token}` }
      });
      setPedidos(response.data);
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

