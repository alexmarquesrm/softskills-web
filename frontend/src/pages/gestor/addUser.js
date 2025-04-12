import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import profilePic from "../../logo.svg";

import Guardar from "../../components/buttons/saveButton";
import InputField from "../../components/textFields/basic";
import Cancelar from "../../components/buttons/cancelButton";
import DropdownCheckbox from "../../components/dropdown/dropdown";

import { FaRegSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";
import { BsArrowReturnLeft } from "react-icons/bs";

const EditarPerfilUtilizador_Gestor = () => {
  const [formData, setFormData] = useState("");
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [ultimoNome, setUltimoNome] = useState("");
  const [nomeUtilizador, setNomeUtilizador] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [email, setEmail] = useState("");
  const [numeroTelemovel, setNumeroTelemovel] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [cargo, setCargo] = useState("cargo Utilizador");
  const [ativo, setAtivo] = useState(true);
  const [tipoUtilizador, setTipoUtilizador] = useState([]);
  
  
  const handleCheckboxChange = (value) => {
    setTipoUtilizador((prev) =>
      prev.includes(value) 
        ? prev.filter((tipo) => tipo !== value) 
        : [...prev, value] 
    );
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-start">
        <Col md={10} className="mb-4">
          <h2 className="form-title">Adicionar Utilizador</h2>
        </Col>
      </Row>

      <Row className="justify-content-start mb-4">
        <Col md={12}>
          <div className="border p-4 shadow-sm rounded">
            <Row
              className="mb-3"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Col
                xs={4}
                sm={3}
                md={2}
                className="text-start"
                style={{
                  paddingRight: "1em",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className="perfil-container d-flex flex-column align-items-center">
                  <img
                    src={profilePic}
                    alt="Foto de Perfil"
                    className="rounded-circle perfil-img shadow-lg"
                    width="120"
                    height="120"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </Col>

              <Col
                xs={8}
                sm={9}
                md={10}
                className="text-start d-flex flex-column justify-content-center"
                style={{ paddingLeft: "1em" }}
              >
                <h5 className="mt-3 perfil-nome">Nome do utilizador</h5>
                <p>{cargo}</p>
               
              </Col>
            </Row>

            <hr />

            <Row className="justify-content-start">
              <Col md={12}>
                <div className="w-100">
                  <Row className="mb-3">
                    <InputField
                      label="Primeiro Nome"
                      type="text"
                      placeholder=""
                      name="primeiroNome"
                      value={formData.primeiroNome}
                      onChange={handleChange}
                      colSize={6}
                    />
                    <InputField
                      label="Último Nome"
                      type="text"
                      placeholder=""
                      name="ultimoNome"
                      value={formData.ultimoNome}
                      onChange={handleChange}
                      colSize={6}
                    />
                  </Row>

                  <Row className="mb-3">
                    <InputField
                      label="Nome Utilizador"
                      type="text"
                      placeholder=""
                      name="nomeUtilizador"
                      value={formData.nomeUtilizador}
                      onChange={handleChange}
                      icon={<FaUser />}
                      colSize={6}
                    />
                    <InputField
                      label="Data Nascimento"
                      type="date"
                      placeholder="--/--/----"
                      name="dataNasc"
                      value={formData.dataNasc}
                      onChange={handleChange}
                      icon={<IoCalendarNumberSharp />}
                      colSize={6}
                      //readOnly
                      
                    />
                  </Row>

                  <Row className="mb-3">
                    <InputField
                      label="Email"
                      type="email"
                      placeholder=""
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      icon={<MdEmail />}
                      colSize={6}
                    />
                    <InputField
                      label="Número Telemóvel"
                      type="tel"
                      placeholder=""
                      name="numeroTelemovel"
                      value={formData.numeroTelemovel}
                      onChange={handleChange}
                      icon={<FaMobileAlt />}
                      colSize={6}
                    />
                  </Row>

                  <Row className="mb-3">
                    <InputField
                      label="Departamento"
                      type="text"
                      placeholder=""
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      icon={<FaBuilding />}
                      colSize={6}
                    />
                    <InputField
                      label="Cargo"
                      type="text"
                      placeholder=""
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      colSize={6}
                    />
                  </Row>
                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Label>Tipo de Utilizador:</Form.Label>
                      <DropdownCheckbox
                        label="Selecionar"
                        options={["Formando", "Formador"]}
                        selectedOptions={tipoUtilizador}
                        onChange={(selected) => setTipoUtilizador(selected)}
                        isMulti={true}
                        useCheckboxUI={true}
                      />
                    </Col>

                  </Row>
                  <Col md={6}>
                    <Form.Check
                      type="switch"
                      id="ativoSwitch"
                      label={ativo ? "Conta Ativa" : "Conta Inativa"}
                      checked={ativo}
                      onChange={() => setAtivo(!ativo)}
                      className="mt-1"
                    />
                  </Col>

                  <div className="d-flex justify-content-center mt-4">
                    <Cancelar
                      text={"Cancelar"}
                      onClick={() => alert("Botão Cancelar clicado")}
                      Icon={BsArrowReturnLeft}
                      inline={true}
                    />
                    <Guardar
                      text={"Criar Utilizador"}
                      onClick={() => alert("Botão Criar clicado")}
                      Icon={FaRegSave}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditarPerfilUtilizador_Gestor;
