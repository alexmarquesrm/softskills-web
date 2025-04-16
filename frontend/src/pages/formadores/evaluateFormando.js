import React from "react";
import { Container, Card, Table } from "react-bootstrap";
import { BsFillPeopleFill } from "react-icons/bs";

export default function AvaliacaoTrabalho() {
  const formandos = [
    { id: 25638 },
    { id: 24562 },
    { id: 23262 },
    { id: 28662 },
    { id: 24062 },
    { id: 28962 },
  ];

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow-sm p-4">
        <h3>Redes de Segurança</h3>
        <div className="text-muted d-flex align-items-center mb-4">
          <BsFillPeopleFill className="me-2" />
          Síncrono
        </div>

        <div className="fw-semibold fs-5 mb-2">Avaliação trabalho 1</div>
        <div style={{ borderBottom: "3px solid #ccc", marginBottom: "1rem" }}></div>

        <Table className="custom-table" responsive>
          <tbody>
            {formandos.map((formando, idx) => (
              <tr key={idx} className={idx === 0 ? "first-row" : ""}>
                <td>
                  <BsFillPeopleFill className="me-2" />
                  Formando {formando.id}
                </td>
                <td className="text-end">
                  <a
                    href={`/avaliar/${formando.id}`}
                    className="text-primary"
                    style={{ textDecoration: "none" }}
                  >
                    Avaliar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
