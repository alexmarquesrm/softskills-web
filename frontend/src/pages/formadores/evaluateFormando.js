import React, { useState, useEffect } from "react";
import { Container, Card, Badge, Button, Form } from "react-bootstrap";
import { BsFillPeopleFill, BsChatDots, BsArrowReturnLeft, BsDownload, BsFileText, BsSend } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import axios from "../../config/configAxios";
import { useLocation } from "react-router-dom";

import ModalCustom from "../../modals/modalCustom";
import AddButton from "../../components/buttons/addButton";
import Cancelar from "../../components/buttons/cancelButton";
import Guardar from "../../components/buttons/saveButton";
import "./evaluateFormando.css";

export default function AvaliacaoTrabalho() {
  const [formandos, setFormandos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalAvaliacao, setShowModalAvaliacao] = useState(false);
  const [formandoSelecionado, setFormandoSelecionado] = useState(null);
  const [nota, setNota] = useState("");
  const [erroNota, setErroNota] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroAvaliacao, setFiltroAvaliacao] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const materialId = location.state?.materialId;
  const cursoId = location.state?.cursoId;

  useEffect(() => {
    if (materialId && cursoId) {
      fetchSubmissoesPorAvaliacao();
    } else {
      fetchFormandos();
    }
  }, []);

  const fetchFormandos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('/trabalhos/formandos', {
        headers: { Authorization: `${token}` }
      });
      setFormandos(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar dados dos formandos");
      setLoading(false);
    }
  };

  const fetchSubmissoesPorAvaliacao = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`/trabalhos/avaliacao/${materialId}/curso/${cursoId}/submissoes`, {
        headers: { Authorization: `${token}` }
      });
      setFormandos(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar submissões da entrega");
      setLoading(false);
    }
  };

  const abrirAvaliacao = (formando) => {
    setFormandoSelecionado(formando);
    setShowModalAvaliacao(true);
  };

  const fecharModal = () => {
    setFormandoSelecionado(null);
    setShowModal(false);
  };

  const fecharModalAvaliacao = () => {
    setFormandoSelecionado(null);
    setShowModalAvaliacao(false);
    setNota("");
    setErroNota("");
  };

  const handleSubmit = async () => {
    if (!nota) {
      setErroNota("Por favor, selecione uma classificação antes de guardar");
      return;
    }
    setErroNota("");

    try {
      const token = sessionStorage.getItem('token');
      await axios.post('/trabalhos/avaliar', {
        formando_id: formandoSelecionado.formando_id,
        trabalho_id: formandoSelecionado.trabalho_id,
        nota: parseFloat(nota)
      }, {
        headers: { Authorization: `${token}` }
      });

      // Atualizar a lista de formandos após a avaliação
      await fetchFormandos();
      fecharModalAvaliacao();
    } catch (err) {
      setErroNota("Erro ao salvar a avaliação. Tente novamente.");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-container">
      <Container>
        <div className="header-card">
          <h1 className="header-card-title">Avaliação dos Trabalhos</h1>
          <p className="header-card-subtitle">Gerir e avaliar trabalhos dos formandos</p>
        </div>

        <Card className="main-card">
          <div className="deadline-info">
            <BsFileText size={20} className="deadline-icon" />
            <div>
              <strong>Objetivo:</strong> Avaliar a apresentação do trabalho com
              base nos critérios de clareza, conteúdo técnico e originalidade.
              <br />
            </div>
          </div>

          <div className="section-title">
            <IoPersonOutline size={24} className="title-icon" />
            <h4>Avaliar Formandos</h4>
          </div>

          <div className="divider"></div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <Form.Control
              type="text"
              placeholder="Pesquisar formando..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: "250px" }}
            />
            <Form.Select
              value={filtroAvaliacao}
              onChange={(e) => setFiltroAvaliacao(e.target.value)}
              style={{ maxWidth: "200px" }}
            >
              <option value="todos">Todos</option>
              <option value="avaliado">Avaliados</option>
              <option value="pendente">Pendentes</option>
            </Form.Select>
          </div>

          <div className="formandos-container">
            {formandos
              .filter((formando) => {
                const nomeMatch = formando.nome.toLowerCase().includes(searchTerm.toLowerCase());
                const filtroMatch =
                  filtroAvaliacao === "todos" ||
                  (filtroAvaliacao === "avaliado" && formando.nota !== null && formando.nota !== undefined) ||
                  (filtroAvaliacao === "pendente" && (formando.nota === null || formando.nota === undefined));
                return nomeMatch && filtroMatch;
              })
              .map((formando, idx) => (
                <div key={idx} className="student-card">
                  <div className="student-info">
                    <div className="avatar-icon">
                      <BsFillPeopleFill size={18} />
                    </div>
                    <div>
                      <div className="student-name">{formando.nome}</div>
                      <Badge
                        bg={formando.nota !== null && formando.nota !== undefined ? "success" : "warning"}
                        className={formando.nota !== null && formando.nota !== undefined ? "badge-success" : "badge-warning"}
                      >
                        {formando.nota !== null && formando.nota !== undefined ? "Avaliado" : "Pendente"}
                      </Badge>
                      {/* Mostrar ficheiros submetidos */}
                      {formando.ficheiros && formando.ficheiros.length > 0 && (
                        <div className="mt-2">
                          <strong>Ficheiros submetidos:</strong>
                          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {formando.ficheiros.map((file, fidx) => (
                              <li key={fidx} style={{ marginBottom: 4 }}>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => window.open(file.url, '_blank')}
                                  className="me-2"
                                >
                                  <BsDownload className="me-1" /> {file.nome}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="action-buttons">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => abrirAvaliacao(formando)}
                      className="action-button"
                      disabled={formando.nota !== null && formando.nota !== undefined}
                    >
                      <div className="button-content">
                        <BsChatDots size={16} />
                        <span>Avaliar</span>
                      </div>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </Container>

      {/* Modal de Avaliação */}
      <ModalCustom
        show={showModalAvaliacao}
        handleClose={fecharModalAvaliacao}
        title={`Avaliação de ${formandoSelecionado?.nome}`}
      >
        <div className="p-4 rounded" style={{ backgroundColor: "#f9f9f9" }}>
          <Form>
            <Form.Group className="mb-3" controlId="avaliacaoNota">
              <Form.Label>Classificação</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="20"
                value={nota}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (valor === "" || (Number(valor) >= 0 && Number(valor) <= 20)) {
                    setNota(valor);
                    setErroNota("");
                  } else {
                    setErroNota("A nota deve ser entre 0 e 20.");
                  }
                }}
                placeholder="Insira uma nota de 0 a 20"
              />
              {erroNota && <div className="text-danger mt-1">{erroNota}</div>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="comentario">
              <Form.Label>Comentário</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Escreve aqui um comentário sobre o desempenho do formando..."
                style={{ resize: "none" }}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Cancelar text="Cancelar" onClick={fecharModalAvaliacao} Icon={BsArrowReturnLeft} inline={true} />
              <Guardar text="Guardar" onClick={handleSubmit} Icon={BsSend} />
            </div>
          </Form>
        </div>
      </ModalCustom>
    </div>
  );
}