import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { 
    BsFillPeopleFill, 
    BsCalendarCheck, 
    BsPlusCircle, 
    BsPencilSquare, 
    BsFileText, 
    BsCameraVideo, 
    BsBook, 
    BsTools, 
    BsUpload 
  } from "react-icons/bs";
  import { FaRegSave } from "react-icons/fa";


import Guardar from "../../components/buttons/saveButton";
import ModalAdicionarFicheiro from "../../modals/addFile"
import ModalEditarFicheiro from "../../modals/edditFile"

import AddButton from "../../components/buttons/addButton"; 
import EditButton from "../../components/buttons/editButton";

export default function CursoRedesSeguranca() {
      const [addfile, setAddfile] = useState(false);
      const [edditfile, setEdditfile] = useState(false);

      const [showModalAdicionarFicheiro, setshowModalAdicionarFicheiro] = useState(false);
    
    const items = [
        { label: "Apresentação do curso", icon: <BsFileText className="me-2" /> },
        { label: "Vídeo 1", icon: <BsCameraVideo className="me-2" /> },
        { label: "Vídeo 2", icon: <BsCameraVideo className="me-2" /> },
        { label: "Aula Teórica 1", icon: <BsBook className="me-2" /> },
        { label: "Aula Teórica 2", icon: <BsBook className="me-2" /> },
        { label: "Aula Teórica 3", icon: <BsBook className="me-2" /> },
        { label: "Trabalho Prático 1", icon: <BsTools className="me-2" /> },
        { label: "Entrega Trabalho Prático 1", icon: <BsUpload className="me-2" /> },
        { label: "Trabalho Prático 2", icon: <BsTools className="me-2" /> },
      ];

  return (
    <Container className="mt-5 mb-5"> 
      <Card className="shadow-sm p-4">
        <Row className="mb-4">
          <Col>
            <h2>Redes de Segurança</h2>
            <div className="text-muted d-flex align-items-center">
              <BsFillPeopleFill className="me-2" />
              Síncrono
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h5><BsCalendarCheck className="me-2" />Presenças</h5>
            <p>
              <strong>Horário de atendimento (Gabriel Dias - Gab 12):</strong><br />
              <ul>
                <li><strong>Segunda-feira:</strong> 14:30 às 15:30</li>
                <li><strong>Terça-feira:</strong> 10:00 às 11:00</li>
              </ul>
            </p>
          </Col>
        </Row>

        <Row className="align-items-center mb-3">
          <Col><h5>Aulas Teóricas</h5></Col>
          <Col className="text-end">
            <div className="d-flex justify-content-end">
              <AddButton text="Adicionar" Icon={BsPlusCircle} onClick={() => setAddfile(true)} inline={true} />
              
            </div>
          </Col>
        </Row>
      
        <ListGroup variant="flush">
          {items.map((item, idx) => (
            <ListGroup.Item 
              key={idx} 
              className="d-flex justify-content-between align-items-center"
            >
              <span className="d-flex align-items-center">
                {item.icon}
                {item.label}
              </span>
              <EditButton text="" Icon={BsPencilSquare} onClick={() => setEdditfile(true)} inline={true} />
            </ListGroup.Item>
            

          ))}
        </ListGroup>
        <ModalAdicionarFicheiro show={addfile} handleClose={() => setAddfile(false)} />
        <ModalEditarFicheiro show={edditfile} handleClose={() => setEdditfile(false)} />

      </Card>
    </Container>
  );
}
