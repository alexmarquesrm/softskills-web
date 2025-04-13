import React, { useEffect, useState } from "react";
import axios from "../../config/configAxios";
import Card from "../../components/cards/cardDestaque";
import DataTable from '../../components/tables/dataTable';
import CardPedido from '../../components/cards/cardPedido';
import CardRow from '../../components/cards/cardRow';
import { Container, Row, Col, Card as BootstrapCard } from "react-bootstrap";
import { BarChart, FileEarmarkText, ExclamationTriangle } from 'react-bootstrap-icons';
import "./pageGestor.css";

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
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
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
    } finally {
      setLoading(false);
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
    return (
      <Container className="error-container text-center py-5">
        <ExclamationTriangle className="error-icon" />
        <h3 className="mt-3">Ocorreu um erro</h3>
        <p className="text-muted">{error.message}</p>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </Container>
    );
  }

  return (
    <Container fluid className="gestor-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">Bem-vindo, {nome}</p>
        </div>
        <div className="page-actions">
          <button className="btn action-btn">
            <BarChart className="action-icon" />
            Relatórios
          </button>
          <button className="btn action-btn">
            <FileEarmarkText className="action-icon" />
            Exportar Dados
          </button>
        </div>
      </div>
      
      <Card />
      
      <div className="dashboard-metrics">
        <Row className="g-4">
          <Col md={4}>
            <BootstrapCard className="metric-card">
              <BootstrapCard.Body>
                <div className="metric-icon">
                  <div className="icon-bg pedidos-bg">
                    <FileEarmarkText />
                  </div>
                </div>
                <h3 className="metric-value">{pedidos.length}</h3>
                <p className="metric-label">Total de Pedidos</p>
                <div className="metric-progress">
                  <div className="progress-bar pedidos-bar" style={{ width: '70%' }}></div>
                </div>
              </BootstrapCard.Body>
            </BootstrapCard>
          </Col>
          
          <Col md={4}>
            <BootstrapCard className="metric-card">
              <BootstrapCard.Body>
                <div className="metric-icon">
                  <div className="icon-bg denuncias-bg">
                    <ExclamationTriangle />
                  </div>
                </div>
                <h3 className="metric-value">{tableRows.length}</h3>
                <p className="metric-label">Total de Denúncias</p>
                <div className="metric-progress">
                  <div className="progress-bar denuncias-bar" style={{ width: '45%' }}></div>
                </div>
              </BootstrapCard.Body>
            </BootstrapCard>
          </Col>
          
          <Col md={4}>
            <BootstrapCard className="metric-card">
              <BootstrapCard.Body>
                <div className="metric-icon">
                  <div className="icon-bg atividade-bg">
                    <BarChart />
                  </div>
                </div>
                <h3 className="metric-value">12 dias</h3>
                <p className="metric-label">Última Atividade</p>
                <div className="metric-progress">
                  <div className="progress-bar atividade-bar" style={{ width: '85%' }}></div>
                </div>
              </BootstrapCard.Body>
            </BootstrapCard>
          </Col>
        </Row>
      </div>
      
      <div className="section-header">
        <h2 className="section-title">
          <FileEarmarkText className="section-icon" />
          Pedidos
        </h2>
        <div className="section-actions">
          <button className="btn btn-sm btn-outline-primary">Ver Todos</button>
        </div>
      </div>

      <div className="section-content">
        <CardRow dados={pedidos} renderCard={renderPedidoCard} scrollable={true} />
      </div>

      <div className="section-header">
        <h2 className="section-title">
          <ExclamationTriangle className="section-icon" />
          Denúncias
        </h2>
        <div className="section-actions">
          <button className="btn btn-sm btn-outline-primary">Ver Todas</button>
        </div>
      </div>
      
      <div className="section-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando dados...</p>
          </div>
        ) : (
          <DataTable rows={tableRows || []} columns={tableColumns} />
        )}
      </div>
    </Container>
  );
}
