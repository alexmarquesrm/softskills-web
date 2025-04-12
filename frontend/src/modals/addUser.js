import React, { useState, useEffect } from "react";
import axios from "../config/configAxios";

import { Form, Col, Row, Container } from "react-bootstrap";
import profilePic from "../logo.svg";

import Guardar from "../components/buttons/saveButton";
import InputField from "../components/textFields/basic";
import Cancelar from "../components/buttons/cancelButton";
import DropdownCheckbox from "../components/dropdown/dropdown";
import ModalCustom from "./ModalCustom";

import { FaRegSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobileAlt, FaUser, FaBuilding } from "react-icons/fa";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { BsArrowReturnLeft } from "react-icons/bs";

const ModalAddUser = ({ show, onClose }) => {
  const [formData, setFormData] = useState({});
  const [pNome, setPNome] = useState([]);
  const [UNome, setUNome] = useState([]);
  const [username, setusername] = useState([]);
  const [data, setdata] = useState([]);
  const [email, setemail] = useState([]);
  const [numeroTelemovel, setnumeroTelemovel] = useState([]);
  const [departamento, setdepartamento] = useState([]);
  const [cargo, setCargo] = useState();
  const [ativo, setAtivo] = useState(true);
  const [tipoUtilizador, setTipoUtilizador] = useState([]);

console.log(ativo)
console.log(tipoUtilizador)
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const nomeCompleto = `${pNome} ${UNome}`;
      setFormData({
        nome: nomeCompleto,
        username,
        data,
        email,
        numeroTelemovel,
        departamento,
        cargo,
        ativo,
        tipoUtilizador,
      });
      console.log(formData);

      await axios.put(`/colaborador/adicionar`, formData, {
        headers: { Authorization: `${token}` },
      });

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      alert("Erro ao atualizar perfil.");
    }

    onClose();
  };

  useEffect(() => {
    handleSave();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  return (
    <ModalCustom
      show={show}
      handleClose={onClose}
      title="Adicionar Utilizador"
      size="xl"
    >
      <Container className="mt-3">
        <Row className="justify-content-start mb-4">
          <Col md={12}>
            <div className="border p-4 shadow-sm rounded">
           

              <Row className="mb-3">
                <InputField label="Primeiro Nome" type="text" name="pNome" value={formData.pNome || ""} onChange={handleChange} colSize={6} />
                <InputField label="Último Nome" type="text" name="UNome" value={formData.UNome || ""} onChange={handleChange} colSize={6} />
              </Row>

              <Row className="mb-3">
                <InputField label="Nome Utilizador" type="text" name="username" value={formData.username || ""} onChange={handleChange} icon={<FaUser />} colSize={6} />
                <InputField label="Data Nascimento" type="date" name="dataNasc" value={formData.dataNasc || ""} onChange={handleChange} icon={<IoCalendarNumberSharp />} colSize={6} />
              </Row>

              <Row className="mb-3">
                <InputField label="Email" type="email" name="email" value={formData.email || ""} onChange={handleChange} icon={<MdEmail />} colSize={6} />
                <InputField label="Número Telemóvel" type="tel" name="numeroTelemovel" value={formData.numeroTelemovel || ""} onChange={handleChange} icon={<FaMobileAlt />} colSize={6} />
              </Row>

              <Row className="mb-3">
                <InputField label="Departamento" type="text" name="departamento" value={formData.departamento || ""} onChange={handleChange} icon={<FaBuilding />} colSize={6} />
                <InputField label="Cargo" type="text" name="cargo" value={formData.cargo || ""} onChange={handleChange} colSize={6} />
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>Tipo de Utilizador:</Form.Label>
                  <DropdownCheckbox label="Selecionar" options={["Formando", "Formador"]} selectedOptions={tipoUtilizador} onChange={(selected) => setTipoUtilizador(selected)} isMulti={true} useCheckboxUI={false} />
                </Col>
              </Row>

              <Col md={6}>
                <Form.Check type="switch" id="ativoSwitch" label={ativo ? "Conta Ativa" : "Conta Inativa"} checked={ativo} onChange={() => setAtivo(!ativo)} className="mt-1" />
              </Col>

              <div className="d-flex justify-content-center mt-4">
                <Cancelar text={"Cancelar"} onClick={onClose} Icon={BsArrowReturnLeft} inline={true} />
                <Guardar text={"Criar Utilizador"} onClick={handleSave} Icon={FaRegSave} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </ModalCustom>
  );
};

export default ModalAddUser;
