import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import { MessageSquare } from 'react-feather';
import { useNavigate } from "react-router-dom";
import axios from "../../config/configAxios";
/* COMPONENTES */
import DataTable from "../../components/tables/dataTable";
/* CSS */
import "./pedidos.css";

const ListaPedidos = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("all");
  const [tableRows, setTableRows] = useState([]);

  const fetchPedidos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("/pedido", {
        headers: { Authorization: `${token}` },
      });
      setPedidos(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao obter pedidos:", err);
      setError("Não foi possível carregar os pedidos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDadosRelacionados = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const [colaboradoresRes, cursosRes, topicosRes] = await Promise.all([
        axios.get("/colaborador", { headers: { Authorization: `${token}` } }),
        axios.get("/curso", { headers: { Authorization: `${token}` } }),
        axios.get("/topico", { headers: { Authorization: `${token}` } }),
      ]);
      setColaboradores(colaboradoresRes.data);
      setCursos(cursosRes.data);
      setTopicos(topicosRes.data);
    } catch (err) {
      console.error("Erro ao procurar dados relacionados:", err);
    }
  };

  useEffect(() => {
    fetchPedidos();
    fetchDadosRelacionados();
  }, []);

  // Função para visualizar detalhes do pedido
  const handleVerPedido = (pedidoId) => {
    navigate(`/gestor/pedidos/view/${pedidoId}`);
  };


  useEffect(() => {
    if (pedidos.length > 0 && colaboradores.length > 0 && cursos.length > 0 && topicos.length > 0) {

      const enhancedRows = pedidos
        .filter(pedido => {
          if (pedido.tipo === "CURSO") {
            return pedido.ped_curso?.pendente === true;
          } else if (pedido.tipo === "FORUM") {
            return pedido.ped_forum?.pendente === true;
          }
          return false;
        })
        .filter((pedido) => {
          if (filtro === "all") return true;
          if (filtro === "forum") return pedido.tipo === "FORUM";
          if (filtro === "curso") return pedido.tipo === "CURSO";
          return true;
        })
        .map((pedido) => {
          // Find related data
          const colaborador = colaboradores.find((c) => c.colaborador_id === pedido.colaborador_id);
          const curso = pedido.tipo === "CURSO" ? cursos.find((c) => c.curso_id === pedido.referencia_id) : null;
          const topico = pedido.tipo === "FORUM" ? topicos.find((t) => t.topico_id === pedido.referencia_id) : null;

          // Create row with all searchable data
          return {
            id: pedido.pedido_id,
            pedido_id: pedido.pedido_id,
            tipo: pedido.tipo,
            colaborador_id: pedido.colaborador_id,
            referencia_id: pedido.referencia_id,
            data: pedido.data,
            pendente: pedido.pendente,
            // Add text fields for search
            colaboradorNome: colaborador ? colaborador.nome : `Colaborador ${pedido.colaborador_id}`,
            referenciaNome: pedido.tipo === "CURSO"
              ? (curso ? curso.titulo : `Curso ${pedido.referencia_id}`)
              : (topico ? topico.descricao : `Tópico ${pedido.referencia_id}`),
            dataFormatada: new Date(pedido.data).toLocaleString()
          };
        });

      setTableRows(enhancedRows);
    }
  }, [pedidos, colaboradores, cursos, topicos, filtro]);

  const columns = [
    {
      field: "colaboradorNome",
      headerName: "Colaborador",
      sortable: true, flex: 0.1, headerAlign: 'left', align: 'left', disableColumnMenu: true, minWidth: 100,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      sortable: true, flex: 0.5, headerAlign: 'left', align: 'left', disableColumnMenu: true, minWidth: 100,
      renderCell: ({ row }) => row.tipo === "CURSO" ? "Curso" : "Fórum"
    },
    {
      field: "referenciaNome",
      headerName: "Referência",
      sortable: true, flex: 0.5, headerAlign: 'left', align: 'left', disableColumnMenu: true, minWidth: 400,
    },
    {
      field: "data",
      headerName: "Data do Pedido",
      sortable: true,
      type: "date", flex: 0.5, headerAlign: 'left', align: 'left', disableColumnMenu: true, minWidth: 100,
      renderCell: ({ row }) => new Date(row.data).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Ações",
      sortable: false, flex: 0.5, headerAlign: 'center', align: 'center', disableColumnMenu: true, minWidth: 100,
      renderCell: ({ row }) => (
        <>
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => handleVerPedido(row.pedido_id)}
            title="Ver detalhes do pedido"
          >
            <Eye size={18} />
          </button>
        </>
      ),
    },
  ];
  return (
    <Container fluid className="lista-pedidos-container">
      <div className="forum-header">
        <div className="forum-header-content">
          <div className="forum-header-icon">
            <MessageSquare size={32} />
          </div>
          <div className="forum-header-info">
            <h1>Pedidos</h1>
          </div>
        </div>
        <div className="percurso-stats">
          <div className="percurso-stat-item">
            <span className="stat-value">{tableRows.length}</span>
            <span className="stat-label">Total de Pedidos</span>
          </div>
        </div>
      </div>

      <div className="filtro-container">
        <div className="estado-filtro">
          <h6>Estado</h6>
          <div className="filtro-buttons">
            <button
              className={filtro === "all" ? "filtro-button active" : "filtro-button"}
              onClick={() => setFiltro("all")}
            >
              Todos
            </button>
            <button
              className={filtro === "forum" ? "filtro-button active" : "filtro-button"}
              onClick={() => setFiltro("forum")}
            >
              Fóruns
            </button>
            <button
              className={filtro === "curso" ? "filtro-button active" : "filtro-button"}
              onClick={() => setFiltro("curso")}
            >
              Cursos
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando pedidos...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchPedidos}>
            Tentar novamente
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={tableRows || []}
          pageSize={10}
          title="Lista de Pedidos"
          showSearch={true}
          emptyStateMessage="Nenhum pedido encontrado."
        />
      )}
    </Container>
  );
};

export default ListaPedidos;