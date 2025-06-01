import React, { useEffect, useState, useMemo } from "react";
import axios from "../../config/configAxios";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { FileEarmarkText, ExclamationTriangle, ArrowRightCircle, Clock, Person } from 'react-bootstrap-icons';
/* COMPONENTES */
import CardInfo from "../../components/cards/cardDestaque";
import DataTable from '../../components/tables/dataTable';
import CardPedido from '../../components/cards/cardPedido';
import CardRow from '../../components/cards/cardRow';
import WelcomeNotification from "../../components/notifications/WelcomeNotification";
/* CSS */
import "./pageGestor.css";

export default function PaginaGestor() {
  const [tableRows, setTableRows] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saudacao, setSaudacao] = useState('');
  const [dataMaisRecenteDenuncia, setDataMaisRecenteDenuncia] = useState(null);
  const [countFormandos, setCountFormandos] = useState(null);
  const nome = sessionStorage.getItem('nome');
  const navigate = useNavigate();
  const navToPage = (url) => {
    navigate(url)
  }

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
    { field: 'denuncia', headerName: 'Denúncia feita por:', flex: 0.5, headerAlign: 'left', align: 'left', disableColumnMenu: true },
    {
      field: 'motivo', headerName: 'Motivo', flex: 0.4, headerAlign: 'left', disableColumnMenu: false,
      renderCell: ({ row }) => (
        <span className={`badge ${getBadgeClass(row.motivo)}`}>{row.motivo}</span>
      )
    },
    { field: 'descricao', headerName: 'Descrição', flex: 0.8, headerAlign: 'left', align: 'left', disableColumnMenu: true },
    {
      field: 'data', headerName: 'Data', flex: 0.3, headerAlign: 'left', align: 'left', disableColumnMenu: true,
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
            id: '#' + denuncia.denuncia_id,
            denuncia: denuncia.formando.formando_colab.nome,
            motivo: motivoTexto,
            descricao: denuncia.descricao,
            data: formatDate(denuncia.data),
          };
        })
      );
      if (sortedDenuncia.length > 0) {
        const dataMaisRecenteDenuncia = new Date(sortedDenuncia[0].data);
        setDataMaisRecenteDenuncia(dataMaisRecenteDenuncia);
      }
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

  const fetchSaudacao = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('/colaborador/saudacao', {
        headers: { Authorization: `${token}` }
      });
      console.log(response.data);
      setSaudacao(response.data.saudacao);
    } catch (error) {
      console.error('Erro ao obter saudação:', error);
    }
  };

  useEffect(() => {
    fetchDataDenun();
    fetchDataPedidos();
    fetchSaudacao();
  }, []);

  useEffect(() => {
    const fetchContagemFormandos = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`/formando/totalformandos`, {
          headers: { Authorization: `${token}` }
        });

        setCountFormandos(response.data.total);

      } catch (error) {
        console.error("Erro ao carregar estatísticas de formandos:", error);
      }
    };
    fetchContagemFormandos();
  }, []);
  const filteredPedido = useMemo(() => {
    if (pedidos.length === 0) return [];

    return pedidos.filter(pedido => {
      if (pedido.tipo === 'CURSO') {
        return pedido.ped_curso?.pendente === true;
      } else if (pedido.tipo === 'FORUM') {
        return pedido.ped_forum?.pendente === true;
      }
      return false;
    }).sort((a, b) => new Date(b.data) - new Date(a.data));
  }, [pedidos]);

  const dataMaisRecentePedido = filteredPedido.length > 0 ? new Date(filteredPedido[0].data) : null;

  const renderPedidoCard = (pedido, index) => {
    if (!pedido) return null;

    const pedidoId = pedido.pedido_id;

    return (
      <div key={pedidoId || index} onClick={() => navigate(`/gestor/pedidos/view/${pedidoId}`)} style={{ cursor: 'pointer' }}>
      <CardPedido
        key={pedido.pedido_id || index}
        pedido={{
          ...pedido,
          titulo: pedido.tipo === 'CURSO' ? pedido.ped_curso?.titulo : pedido.ped_forum?.descricao,
          formador: pedido.ped_colaborador?.nome,
          tipo: pedido.tipo,
          tipoLabel: pedido.tipo === 'CURSO' ? 'Curso' : 'Fórum',
          data: pedido.data
        }}
        index={index}
        showFormador={true}
        showTimeAgo={true}
      />
      </div>
    );
  };

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
      <WelcomeNotification />
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">{saudacao}, <span className="user-name">{nome}</span></p>
        </div>
      </div>

      <CardInfo />

      <Row className="dashboard-metrics g-4">
        <Col lg={4} md={6}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-header">
                <div className="metric-icon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="icon-bg pedidos-bg">
                    <FileEarmarkText />
                  </div>
                  <p style={{ color: '#718096', fontSize: '1.3rem', fontWeight: '500', marginBottom: '0rem' }}>Total de Pedidos</p>
                </div>
              </div>
              <h3 className="metric-value">{pedidos.length}</h3>
              <div className="metric-progress">
                <div className="progress-bar pedidos-bar" style={{ width: '100%' }}></div>
              </div>
              <p className="metric-detail">Atualizado em {dataMaisRecentePedido ? new Date(dataMaisRecentePedido).toLocaleDateString('pt-PT') : '—'} </p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-header">
                <div className="metric-icon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="icon-bg denuncias-bg">
                    <ExclamationTriangle />
                  </div>
                  <p style={{ color: '#718096', fontSize: '1.3rem', fontWeight: '500', marginBottom: '0rem' }}>Total de Denúncias</p>
                </div>
              </div>
              <h3 className="metric-value">{tableRows.length}</h3>
              <div className="metric-progress">
                <div className="progress-bar denuncias-bar" style={{ width: '100%' }}></div>
              </div>
              <p className="metric-detail"> Atualizado em {dataMaisRecenteDenuncia ? new Date(dataMaisRecenteDenuncia).toLocaleDateString('pt-PT') : '—'}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-header">
                <div className="metric-icon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="icon-bg atividade-bg">
                    <Person />
                  </div>
                  <p style={{ color: '#718096', fontSize: '1.3rem', fontWeight: '500', marginBottom: '0rem' }}>Total Formandos Ativos</p>
                </div>
              </div>
              <h3 className="metric-value">{countFormandos}</h3>
              <div className="metric-progress">
                <div className="progress-bar atividade-bar" style={{ width: '100%' }}></div>
              </div>
              <p className="metric-detail">Atualizado em {new Date().toLocaleDateString('pt-PT')}</p>
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
            <button className="btn btn-link section-link" onClick={() => { navToPage('/gestor/lista/pedidos'); window.scrollTo(0, 0); }}>
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
          ) : filteredPedido.length > 0 ? (
            <CardRow dados={filteredPedido} renderCard={renderPedidoCard} scrollable={true} />
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
              title=""
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