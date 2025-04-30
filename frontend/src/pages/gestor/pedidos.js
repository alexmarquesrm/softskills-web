import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Trash, Eye } from "react-bootstrap-icons";
import axios from "../../config/configAxios";
import DataTable from "../../components/tables/dataTable";
import "./pedidos.css";

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [formadores, setFormadores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("all");
  const [tableRows, setTableRows] = useState([]);

  // Buscar pedidos
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

  const fetchFormadoresECursos = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const [formadoresRes, cursosRes] = await Promise.all([
        axios.get("/formador", { headers: { Authorization: `${token}` } }),
        axios.get("/curso", { headers: { Authorization: `${token}` } }),
      ]);
      setFormadores(formadoresRes.data);
      setCursos(cursosRes.data);
    } catch (err) {
      console.error("Erro ao buscar formadores ou cursos:", err);
    }
  };

  useEffect(() => {
    fetchPedidos();
    fetchFormadoresECursos();
  }, []);

  const handleDelete = async (pedidoId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/pedido/${pedidoId}`, {
        headers: { Authorization: `${token}` },
      });

      setPedidos(pedidos.filter((pedido) => pedido.pedido_id !== pedidoId));
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
      alert("Erro ao excluir pedido. Tente novamente.");
    }
  };

  // Prepare table data with all needed fields for searchability
  useEffect(() => {
    if (pedidos.length > 0 && formadores.length > 0 && cursos.length > 0) {
      // Create enhanced rows with all searchable data
      const enhancedRows = pedidos
        .filter((pedido) => {
          if (filtro === "all") return true;
          if (filtro === "topico") return pedido.tipo === "Tópico Forum";
          if (filtro === "curso") return pedido.tipo === "Curso";
          return true;
        })
        .map((pedido) => {
          // Find related formador and curso
          const formador = formadores.find((f) => f.id === pedido.formador_id);
          const curso = cursos.find((c) => c.id === pedido.curso_id);
          
          // Create row with all searchable data
          return {
            id: pedido.pedido_id, // Used for unique key
            pedido_id: pedido.pedido_id,
            tipo: pedido.tipo,
            formador_id: pedido.formador_id,
            curso_id: pedido.curso_id,
            data: pedido.data,
            // Add text fields for search
            formadorNome: formador ? formador.colaborador.nome : `Formador ${pedido.formador_id}`,
            cursoTitulo: curso ? curso.titulo : `Curso ${pedido.curso_id}`,
            dataFormatada: new Date(pedido.data).toLocaleString()
          };
        });
      
      setTableRows(enhancedRows);
    }
  }, [pedidos, formadores, cursos, filtro]);

  const columns = [
    {
      field: "formadorNome", // Use text field for searching
      headerName: "Formador",
      sortable: true,
      searchable: true
    },
    {
      field: "cursoTitulo", 
      headerName: "Curso",
      sortable: true,
      searchable: true
    },
    {
      field: "data",
      headerName: "Data do Pedido",
      sortable: true,
      type: "date",
      renderCell: ({ row }) => new Date(row.data).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Ações",
      sortable: false,
      searchable: false,
      renderCell: ({ row }) => (
        <>
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => console.log(`Ver pedido ${row.pedido_id}`)}
          >
            <Eye size={18} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(row.pedido_id)}
          >
            <Trash size={18} />
          </button>
        </>
      ),
    },
  ];

  return (
    <Container fluid className="lista-pedidos-container">
      <div className="page-header">
        <h1 className="page-title">Pedidos</h1>
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
              className={filtro === "topico" ? "filtro-button active" : "filtro-button"}
              onClick={() => setFiltro("topico")}
            >
              Tópico de Fórum
            </button>
            <button
              className={filtro === "curso" ? "filtro-button active" : "filtro-button"}
              onClick={() => setFiltro("curso")}
            >
              Curso
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