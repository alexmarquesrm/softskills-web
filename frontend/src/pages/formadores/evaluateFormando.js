import React, { useState } from "react";
import { Container, Card, Badge, Button, Form } from "react-bootstrap";
import { BsFillPeopleFill, BsChatDots, BsArrowReturnLeft, BsDownload, BsFileText, BsSend } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";

import ModalCustom from "../../modals/modalCustom";
import AddButton from "../../components/buttons/addButton";
import Cancelar from "../../components/buttons/cancelButton";
import Guardar from "../../components/buttons/saveButton";
import "./evaluateFormando.css";

export default function AvaliacaoTrabalho() {
  const formandos = [
    { nome: "Ana Silva", avaliado: true },
    { nome: "Bruno Costa", avaliado: false },
    { nome: "Carla Dias", avaliado: true },
    { nome: "Daniel Fonseca", avaliado: false },
    { nome: "Eduarda Ramos", avaliado: true },
    { nome: "Fábio Nunes", avaliado: false },
    { nome: "Gabriela Matos", avaliado: true },
    { nome: "Henrique Lopes", avaliado: false },
    { nome: "Inês Carvalho", avaliado: true },
    { nome: "João Pereira", avaliado: false },
    { nome: "Liliana Rocha", avaliado: true },
    { nome: "Marco Silva", avaliado: false },
  ];

  const [showModal, setShowModal] = useState(false);
  const [showModalAvaliacao, setShowModalAvaliacao] = useState(false);
  const [formandoSelecionado, setFormandoSelecionado] = useState(null);
  const [nota, setNota] = useState("");
  const [erroNota, setErroNota] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroAvaliacao, setFiltroAvaliacao] = useState("todos");

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

  const handleSubmit = () => {
    if (!nota) {
      setErroNota("Por favor, selecione uma classificação antes de guardar");
      return;
    }
    setErroNota("");
    alert("Dados enviados");
    fecharModalAvaliacao();
  };

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
                  (filtroAvaliacao === "avaliado" && formando.avaliado) ||
                  (filtroAvaliacao === "pendente" && !formando.avaliado);
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
                        bg={formando.avaliado ? "success" : "warning"}
                        className={formando.avaliado ? "badge-success" : "badge-warning"}
                      >
                        {formando.avaliado ? "Avaliado" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => abrirAvaliacao(formando)}
                      className="action-button"
                    >
                      <div className="button-content">
                        <BsChatDots size={16} />
                        <span>Avaliar</span>
                      </div>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => ('')}
                      className="secondary-button"
                    >
                      <div className="button-content">
                        <BsDownload size={16} />
                        <span>Download</span>
                      </div>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </Container>

      {/* Modal de Notas */}
      <ModalCustom
        show={showModal}
        handleClose={fecharModal}
        title={`Notas de ${formandoSelecionado?.nome}`}
      >
        <div className="modal-content">
          <Form>
            <Form.Group className="mb-3" controlId="comentario">
              <Form.Label className="form-label">Comentário</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Escreve aqui um comentário sobre o desempenho do formando..."
                className="form-control-custom"
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <AddButton
                text="Guardar Nota"
                onClick={fecharModal}
                variant="primary"
                size="sm"
              />
            </div>
          </Form>
        </div>
      </ModalCustom>

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