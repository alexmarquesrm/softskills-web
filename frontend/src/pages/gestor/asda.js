import React, { useEffect, useState } from "react";
import axios from "../../config/configAxios";
import { Container, Row, Col, Card } from "react-bootstrap";
import Card from "../../components/cards/cardDestaque";
import DataTable from '../../components/tables/dataTable';
import CardPedido from '../../components/cards/cardPedido';
import CardRow from '../../components/cards/cardRow';
import { 
  BarChart, 
  FileEarmarkText, 
  ExclamationTriangle, 
  Download, 
  ArrowRightCircle,
  Clock
} from 'react-bootstrap-icons';
import "./pageGestor.css";

export default function PaginaGestor() {
  const [tableRows, setTableRows] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nome = sessionStorage.getItem('nome');

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

  const tableColumns = [
    { field: 'id', headerName: 'Nº Denuncia', flex: 0.3, headerAlign: 'left', disableColumnMenu: true },
    { field: 'denuncia', headerName: 'Denúncia feita por:', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
    { 
      field: 'motivo', 
      headerName: 'Motivo', 
      flex: 0.4, 
      headerAlign: 'left', 
      disableColumnMenu: false,
      renderCell: ({ row }) => (
        <span className={`badge ${getBadgeClass(row.motivo)}`}>{row.motivo}</span>
      )
    },
    { field: 'descricao', headerName: 'Descrição', flex: 0.8, headerAlign: 'left', disableColumnMenu: true },
    { 
      field: 'data', 
      headerName: 'Data', 
      flex: 0.3, 
      headerAlign: 'left', 
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <span className="text-muted d-flex align-items-center">
          <Clock size={14} className="me-1" />
          {row.data}
        </span>
      )
    },
  ];

  const getBadgeClass = (motivo) => {
    switch (motivo) {
      case 'Spam': return 'bg-warning text-dark';
      case 'Inapropriado': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

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
        <div className="error-icon-container">
          <ExclamationTriangle className="error-icon" />
        </div>
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
        <div className="page-header-content">
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">Bem-vindo, <span className="user-name">{nome}</span></p>
        </div>
        <div className="page-actions">
          <button className="btn action-btn">
            <BarChart className="action-icon" />
            <span className="action-text">Relatórios</span>
          </button>
          <button className="btn action-btn">
            <Download className="action-icon" />
            <span className="action-text">Exportar Dados</span>
          </button>
        </div>
      </div>
      
      <Card />
      
      <Row className="dashboard-metrics g-4">
        <Col lg={4} md={6}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-header">
                <div className="metric-icon">
                  <div className="icon-bg pedidos-bg">
                    <FileEarmarkText />
                  </div>
                </div>
                <div className="metric-trend trend-up">
                  <span>+8%</span>
                </div>
              </div>
              <h3 className="metric-value">{pedidos.length}</h3>
              <p className="metric-label">Total de Pedidos</p>
              <div className="metric-progress">
                <div className="progress-bar pedidos-bar" style={{ width: '70%' }}></div>
              </div>
              <p className="metric-detail">70% do objetivo mensal</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} md={6}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-header">
                <div className="metric-icon">
                  <div className="icon-bg denuncias-bg">
                    <ExclamationTriangle />
                  </div>
                </div>
                <div className="metric-trend trend-down">
                  <span>-12%</span>
                </div>
              </div>
              <h3 className="metric-value">{tableRows.length}</h3>
              <p className="metric-label">Total de Denúncias</p>
              <div className="metric-progress">
                <div className="progress-bar denuncias-bar" style={{ width: '45%' }}></div>
              </div>
              <p className="metric-detail">45% do total anterior</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} md={6}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-header">
                <div className="metric-icon">
                  <div className="icon-bg atividade-bg">
                    <Clock />
                  </div>
                </div>
                <div className="metric-trend trend-neutral">
                  <span>±0%</span>
                </div>
              </div>
              <h3 className="metric-value">12 dias</h3>
              <p className="metric-label">Última Atividade</p>
              <div className="metric-progress">
                <div className="progress-bar atividade-bar" style={{ width: '85%' }}></div>
              </div>
              <p className="metric-detail">Atualizado em 4/Abr/2025</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">
            <FileEarmarkText className="section-icon" />
            Pedidos Recentes
          </h2>
          <div className="section-actions">
            <button className="btn btn-link section-link">
              Ver Todos <ArrowRightCircle size={16} className="ms-1" />
            </button>
          </div>
        </div>

        <div className="section-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando pedidos...</p>
            </div>
          ) : pedidos.length > 0 ? (
            <CardRow dados={pedidos} renderCard={renderPedidoCard} scrollable={true} />
          ) : (
            <div className="empty-state">
              <FileEarmarkText size={40} className="empty-icon" />
              <p>Nenhum pedido encontrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">
            <ExclamationTriangle className="section-icon" />
            Denúncias Recentes
          </h2>
          <div className="section-actions">
            <button className="btn btn-link section-link">
              Ver Todas <ArrowRightCircle size={16} className="ms-1" />
            </button>
          </div>
        </div>
        
        <div className="section-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando denúncias...</p>
            </div>
          ) : tableRows.length > 0 ? (
            <DataTable 
              rows={tableRows} 
              columns={tableColumns} 
              showSearch={true}
              pageSize={5}
              emptyStateMessage="Nenhuma denúncia encontrada" 
            />
          ) : (
            <div className="empty-state">
              <ExclamationTriangle size={40} className="empty-icon" />
              <p>Nenhuma denúncia encontrada</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}