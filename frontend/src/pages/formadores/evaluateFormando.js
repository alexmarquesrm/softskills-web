import React from "react";
import { Container, Card, Table } from "react-bootstrap";
import { BsFillPeopleFill } from "react-icons/bs";
import "./evaluateFormando.css"; 

export default function AvaliacaoTrabalho() {
  const formandos = [
    { id: 25638 },
    { id: 24562 },
    { id: 23262 },
    { id: 28662 },
    { id: 24062 },
    { id: 28962 },
    { id: 27962 },
    { id: 23962 },
    { id: 22962 },
    { id: 21462 },
    { id: 24562 },
    { id: 21212 },
  ];

  const cores = [
    "#ffc107", 
    "#dc3545", 
    "#28a745", 
    "#17a2b8", 
    "#6610f2", 
    "#416699", 
  ];

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow-sm p-4">
      
        <div className="caixa-redes">
          <h4>Redes de Segurança</h4>
          <div className="sinc-meta">
            <BsFillPeopleFill className="me-2" />
            Síncrono
          </div>
        </div>

        <div className="fw-semibold fs-5 mb-2" style={{ color: "#222" }}>
          Avaliação trabalho 1
        </div>

        <div className="divider"></div>

        
        <Table responsive borderless className="mb-0">
          <tbody>
            {formandos.map((formando, idx) => (
              <tr
                key={idx}
                className="formando-row"
                style={{
                  borderLeft: `3px solid ${cores[idx % cores.length]}`, 
                }}
              >
                <td className="py-3 px-4">
                  <BsFillPeopleFill className="me-2 text-secondary" />
                  Formando {formando.id}
                </td>
                <td className="text-end py-3 px-4">
                  <a
                    href={`/avaliar/${formando.id}`}
                    className="text-decoration-none"
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
