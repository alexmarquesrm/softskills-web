import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import ModalCustom from "./ModalCustom";

import profilePic from "../logo.svg";
import Guardar from "../components/buttons/saveButton";
import InputField from "../components/textFields/basic";
import Cancelar from "../components/buttons/cancelButton";
import DropdownCheckbox from "../components/dropdown/dropdown";

import { FaRegSave, FaMobileAlt, FaUser, FaBuilding } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { BsArrowReturnLeft } from "react-icons/bs";

const ModalEditarUtilizador = ({ show, onClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);
  const [ativo, setAtivo] = useState(initialData.ativo ?? true);
  const [tipoUtilizador, setTipoUtilizador] = useState(initialData.tipoUtilizador || []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    const userData = { ...formData, ativo, tipoUtilizador };
    console.log("Salvar alterações:", userData);
    if (onSave) onSave(userData);
    onClose();
  };

  return (
    <ModalCustom show={show} handleClose={onClose} title="Editar Utilizador" size="xl">
      <Row className="justify-content-start mb-4">
        <Col md={12}>
          <div className="border p-4 shadow-sm rounded">
            <Row className="mb-3 align-items-center">
              <Col xs={4} sm={3} md={2} className="d-flex justify-content-center">
                <img
                  src={profilePic}
                  alt="Foto de Perfil"
                  className="rounded-circle shadow-lg"
                  width="120"
                  height="120"
                  style={{ objectFit: "cover" }}
                />
              </Col>
              <Col xs={8} sm={9} md={10}>
                <h5 className="mt-3 perfil-nome">
                  {formData.primeiroNome || "Joana"} {formData.ultimoNome || "Marques"}
                </h5>
                <p>{formData.cargo || "Designer"}</p>
              </Col>
            </Row>

            <hr />

            <Row className="mb-3">
              <InputField
                label="Primeiro Nome"
                type="text"
                name="primeiroNome"
                value={formData.primeiroNome || ""}
                onChange={handleChange}
                colSize={6}
              />
              <InputField
                label="Último Nome"
                type="text"
                name="ultimoNome"
                value={formData.ultimoNome || ""}
                onChange={handleChange}
                colSize={6}
              />
            </Row>

            <Row className="mb-3">
              <InputField
                label="Nome Utilizador"
                type="text"
                name="nomeUtilizador"
                value={formData.nomeUtilizador || ""}
                onChange={handleChange}
                icon={<FaUser />}
                colSize={6}
              />
              <InputField
                label="Data Nascimento"
                type="date"
                name="dataNasc"
                value={formData.dataNasc || ""}
                onChange={handleChange}
                icon={<IoCalendarNumberSharp />}
                colSize={6}
              />
            </Row>

            <Row className="mb-3">
              <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                icon={<MdEmail />}
                colSize={6}
              />
              <InputField
                label="Número Telemóvel"
                type="tel"
                name="numeroTelemovel"
                value={formData.numeroTelemovel || ""}
                onChange={handleChange}
                icon={<FaMobileAlt />}
                colSize={6}
              />
            </Row>

            <Row className="mb-3">
              <InputField
                label="Departamento"
                type="text"
                name="departamento"
                value={formData.departamento || ""}
                onChange={handleChange}
                icon={<FaBuilding />}
                colSize={6}
              />
              <InputField
                label="Cargo"
                type="text"
                name="cargo"
                value={formData.cargo || ""}
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
                text="Cancelar"
                onClick={onClose}
                Icon={BsArrowReturnLeft}
                inline={true}
              />
              <Guardar
                text="Guardar"
                onClick={handleSave}
                Icon={FaRegSave}
              />
            </div>
          </div>
        </Col>
      </Row>
    </ModalCustom>
  );
};

export default ModalEditarUtilizador;
