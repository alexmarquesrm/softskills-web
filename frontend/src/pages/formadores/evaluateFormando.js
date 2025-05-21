import React, { useState } from "react";
import { Container, Card, Table, Badge, Button, Form } from "react-bootstrap";
import { BsFillPeopleFill, BsChatDots, BsArrowReturnLeft } from "react-icons/bs";
import { BsSend } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";


import ModalCustom from "../../modals/modalCustom";
import "./evaluateFormando.css";
import AddButton from "../../components/buttons/addButton";
import Cancelar from "../../components/buttons/cancelButton";
import Guardar from "../../components/buttons/saveButton";

export default function AvaliacaoTrabalho() {
  const cursoNome = "Curso de Redes de Segurança";

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
    if (!nota) {
      setErroNota("Por favor, selecione uma classificação antes de guardar");
      return;
    }
    setErroNota("");
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

        <div className="title-container">
          <IoPersonOutline size={28} className="title-icon" />
          <h1>Avaliar Formandos</h1>
        </div>

        <div className="divider mb-3"></div>

        <Table responsive borderless className="mb-0">
          <tbody>
            {formandos.map((formando, idx) => (
              <tr key={idx} className="formando-row">
                <td className="py-3 px-4 d-flex flex-column">
                  <div className="d-flex align-items-center mb-1">
                    <BsFillPeopleFill className="me-2 text-secondary" />
                    <strong>{formando.nome}</strong>
                  </div>
                  <div className="text-muted small">
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
                    variant="primary"
                    size="sm"
                    className="me-3"
                    onClick={() => ('')}
                  >
                    Download Ficheiro
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

    </Container>
  );
}
