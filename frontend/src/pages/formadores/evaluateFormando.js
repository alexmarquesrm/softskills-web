import React, { useState } from "react";
import { Container, Card, Table, Badge, Button, Form } from "react-bootstrap";
import { BsFillPeopleFill, BsChatDots, BsArrowReturnLeft } from "react-icons/bs";
import { BsSend } from "react-icons/bs";

import ModalCustom from "../../modals/modalCustom";
import "./evaluateFormando.css";
import AddButton from "../../components/buttons/addButton";
import Cancelar from "../../components/buttons/cancelButton";
import Guardar from "../../components/buttons/saveButton";

export default function AvaliacaoTrabalho() {
  const cursoNome = "Curso de Redes de Segurança";

  const formandos = [
    { id: 25638, nome: "Ana Silva", progresso: 75, avaliado: true },
    { id: 24562, nome: "Bruno Costa", progresso: 60, avaliado: false },
    { id: 23262, nome: "Carla Dias", progresso: 90, avaliado: true },
    { id: 28662, nome: "Daniel Fonseca", progresso: 45, avaliado: false },
    { id: 24062, nome: "Eduarda Ramos", progresso: 80, avaliado: true },
    { id: 28962, nome: "Fábio Nunes", progresso: 55, avaliado: false },
    { id: 27962, nome: "Gabriela Matos", progresso: 70, avaliado: true },
    { id: 23962, nome: "Henrique Lopes", progresso: 65, avaliado: false },
    { id: 22962, nome: "Inês Carvalho", progresso: 85, avaliado: true },
    { id: 21462, nome: "João Pereira", progresso: 50, avaliado: false },
    { id: 24562, nome: "Liliana Rocha", progresso: 95, avaliado: true },
    { id: 21212, nome: "Marco Silva", progresso: 40, avaliado: false },
  ];

  const [showModal, setShowModal] = useState(false);
  const [showModalAvaliacao, setShowModalAvaliacao] = useState(false);
  const [formandoSelecionado, setFormandoSelecionado] = useState(null);
  const [nota, setNota] = useState("");

  const abrirNotas = (formando) => {
    setFormandoSelecionado(formando);
    setShowModal(true);
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
  };

  const handleSubmit = () => {
    alert("Dados enviados");
    fecharModalAvaliacao();
  };

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow-sm p-4">
        <div className="mb-4">
          <h4 className="mb-1">Avaliação do Trabalho 1</h4>
          <h6 className="text-muted">{cursoNome}</h6>
        </div>

        <div className="mb-4">
          <p>
            <strong>Objetivo:</strong> Avaliar a apresentação do trabalho com
            base nos critérios de clareza, conteúdo técnico e originalidade.
          </p>
          <p>
            <strong>Data limite:</strong> 25 de Abril de 2025
          </p>
        </div>

        <div className="caixa-redes mb-3">
          <h6 className="mb-0">Formato da aula</h6>
          <div className="sinc-meta">
            <BsFillPeopleFill className="me-2" />
            Síncrono
          </div>
        </div>

        <div className="divider mb-3"></div>

        <Table responsive borderless className="mb-0">
          <tbody>
            {formandos.map((formando, idx) => (
              <tr key={idx} className="formando-row">
                <td className="py-3 px-4 d-flex flex-column">
                  <div className="d-flex align-items-center mb-1">
                    <BsFillPeopleFill className="me-2 text-secondary" />
                    <strong>{formando.nome}</strong> (ID: {formando.id})
                  </div>
                  <div className="text-muted small">
                    Progresso: {formando.progresso}% ·{" "}
                    <Badge bg={formando.avaliado ? "success" : "warning"}>
                      {formando.avaliado ? "Avaliado" : "Pendente"}
                    </Badge>
                  </div>
                </td>
                <td className="text-end py-3 px-4">
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-3"
                    onClick={() => abrirAvaliacao(formando)}
                  >
                    Avaliar
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => abrirNotas(formando)}
                  >
                    <BsChatDots className="me-1" />
                    Notas
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Modal de Notas */}
      <ModalCustom
        show={showModal}
        handleClose={fecharModal}
        title={`Notas de ${formandoSelecionado?.nome}`}
      >
        <div
          className="border p-4 shadow-sm rounded"
          style={{ backgroundColor: "#fff" }}
        >
          <Form>
            <Form.Group className="mb-3" controlId="comentario">
              <Form.Label>Comentário</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Escreve aqui um comentário sobre o desempenho do formando..."
                style={{ resize: "none" }}
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
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




          <h6 className="mb-3">Ficheiros Entregues</h6>
          <div className="mb-3">
            <div className="d-flex flex-column gap-2">
              {(formandoSelecionado?.ficheiros || []).map((ficheiro, idx) => {
                const tipoIcone = {
                  pdf: "bi bi-file-earmark-pdf text-danger",
                  csv: "bi bi-file-earmark-spreadsheet text-success",
                  doc: "bi bi-file-earmark-word text-primary",
                  default: "bi bi-file-earmark"
                };
                const iconeClasse = tipoIcone[ficheiro.tipo] || tipoIcone.default;

                return (
                  <div
                    key={idx}
                    className="p-2 bg-light border rounded d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <i className={`${iconeClasse} me-2`}></i>
                      {ficheiro.nome}
                    </span>
                    <div className="d-flex gap-3 align-items-center">
                      <a href={ficheiro.url} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-eye-fill text-primary" title="Visualizar"></i>
                      </a>
                      <a href={ficheiro.url} download>
                        <i className="bi bi-download" title="Download"></i>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Form>
            <Form.Group className="mb-3" controlId="avaliacaoNota">
              <Form.Label>Classificação</Form.Label>
              <Form.Select
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              >
                <option value="">Seleciona uma nota</option>
                <option value="1">1 - Muito Fraco</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 - Excelente</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2"> 
              <Cancelar text="Cancelar" onClick={fecharModalAvaliacao} Icon={BsArrowReturnLeft} inline={true} />
              <Guardar text="Guardar" onClick={handleSubmit} Icon={BsSend} />
            </div>
          </Form>
        </div>
      </ModalCustom>

    </Container>
  );
}
