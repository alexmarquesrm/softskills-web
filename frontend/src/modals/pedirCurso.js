import React, { useState } from "react";
import { Modal, Button, Container, Row, Col, Form } from "react-bootstrap";
import profilePic from "../logo.svg";

import Guardar from "../components/buttons/saveButton";
import InputField from "../components/textFields/basic";
import Cancelar from "../components/buttons/cancelButton";
import DropdownCheckbox from "../components/dropdown/dropdown";


import { BsArrowReturnLeft } from "react-icons/bs";
import { LuSend } from "react-icons/lu";
import { IoMdTime } from "react-icons/io";

const ModalEditarPerfil = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({});
    const [nomecurso, setnomecurso] = useState({});
    const [horas, sethoras] = useState({});
    const [categoria, setcategoria] = useState([]);
    const [area, setarea] = useState([]);
    const [topico, settopico] = useState([]);
    const [dificuldade, setdificuldade] = useState([]);
    const [certificado, setcertificado] = useState([]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };
   

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Pedir Curso</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="mb-4">
                        <Col md={12}>
                            <div className="border p-4 shadow-sm rounded">
                               

                                

                                <Row className="mb-3">
                                    <InputField
                                        label="Nome do Curso"
                                        type="text"
                                        placeholder="Nome"
                                        name="nomecurso"
                                        value={formData.nomecurso}
                                        onChange={handleChange}
                                        colSize={6}
                                    />
                                    <InputField
                                        label="Número de Horas"
                                        type="number"
                                        placeholder="Horas"
                                        name="horas"
                                        value={formData.horas}
                                        onChange={handleChange}
                                        icon={<IoMdTime />}
                                        colSize={6}
                                    />
                                </Row>

                                <Row className="mb-3">
                                <Col md={6}>
                                <Form.Label>Categoria:</Form.Label>
                                <DropdownCheckbox
                                    label="Selecionar"
                                    options={["Desenvolvimento", "Marketing","Design"]}
                                    selectedOptions={categoria}
                                    onChange={(selected) => setcategoria(selected)}
                                    isMulti={false}
                                    useCheckboxUI={false}
                                />
                                
                                </Col>
                               
                              
                                <Col md={6}>
                                <Form.Label>Área:</Form.Label>
                                <DropdownCheckbox
                                    label="Selecionar"
                                    options={["Desenvolvimento Movel", "Desenvolvimento Web","Desenvolvimento de Jogos"]}
                                    selectedOptions={area}
                                    onChange={(selected) => setarea(selected)}
                                    isMulti={false}
                                    useCheckboxUI={false}
                                />
                                
                                </Col>
                                
                               
                                </Row>

                                <Row className="mb-3">
    
                                <Col md={6}>
                                <Form.Label>Tópico:</Form.Label>
                                <DropdownCheckbox
                                    label="Selecionar"
                                    options={["Topico 1", "Topico 2","Topico 3"]}
                                    selectedOptions={topico}
                                    onChange={(selected) => settopico(selected)}
                                    isMulti={false}
                                    useCheckboxUI={false}
                                />
                                 </Col>


                                 <Col md={6}>
                                <Form.Label>Grau de Dificuldade:</Form.Label>
                                <DropdownCheckbox
                                    label="Selecionar"
                                    options={["Dificuldade 1", "Dificuldade 2","Dificuldade 3","Dificuldade 4"]}
                                    selectedOptions={dificuldade}
                                    onChange={(selected) => setdificuldade(selected)}
                                    isMulti={false}
                                    useCheckboxUI={false}
                                />
                                 </Col>
                                </Row>
                                <Row className="mb-3">
    
                                <Col md={6}>
                                <Form.Label>Certificado:</Form.Label>
                                <DropdownCheckbox
                                    label="Selecionar"
                                    options={["Sim", "Não"]}
                                    selectedOptions={certificado}
                                    onChange={(selected) => setcertificado(selected)}
                                    isMulti={false}
                                    useCheckboxUI={false}
                                />
                                 </Col>
                                 </Row>
                               

                                
                                <Row className="mb-3">
                    <InputField
                      label="Descrição"
                      type="textarea"
                      placeholder="Tudo sobre o curso"
                      name="sobreMim"
                      value={formData.sobreMim}
                      onChange={handleChange}
                      colSize={12}
                      rows={5}
                      style={{ resize: "none" }}
                    />
                  </Row>

                                <div className="d-flex justify-content-center mt-4">
                                    <Cancelar
                                        text={"Cancelar"}
                                        onClick={handleClose}
                                        Icon={BsArrowReturnLeft}
                                        inline={true}
                                    />
                                    <Guardar
                                        text={"Enviar"}
                                        onClick={() => alert("Botão Enviar clicado")}
                                        Icon={LuSend}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default ModalEditarPerfil;


//Exemplo para depois puxar a modal
// const [showModalEditar, setShowModalEditar] = useState(false);
  

                        {/* Modal teste para pedir curso */}
                        //<Guardar
                          //text={"Guardar"}
                          //onClick={() => setShowModalEditar(true)}
                          //Icon={FaRegSave}
                        ///>
                        //<ModalEditarPerfil show={showModalEditar} handleClose={() => setShowModalEditar(false)} />
                  {/* --------------------------------------------------- */}
