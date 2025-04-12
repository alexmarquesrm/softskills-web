import React, { useState, useEffect } from "react";
import axios from "../../config/configAxios";
import { Row, Col, Form } from "react-bootstrap";
import profilePic from "../../logo.svg";
/* COMPONENTES */
import Guardar from "../../components/buttons/saveButton";
import InputField from "../../components/textFields/basic";
import Cancelar from "../../components/buttons/cancelButton";
import DropdownCheckbox from "../../components/dropdown/dropdown";
/* MODALS */
import ModalCustom from "../modalCustom";
/* ICONS */
import { FaRegSave, FaMobileAlt, FaUser, FaBuilding } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { BsArrowReturnLeft } from "react-icons/bs";

export default function EditProfile ({ show, onClose, onSave, initialData = {} }){
  const [formData, setFormData] = useState({
    primeiroNome: "",
    ultimoNome: "",
    username: "",
    dataNasc: "",
    email: "",
    telefone: "",
    departamento: "",
    cargo: "",
  });

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const id = initialData.id;

      const response = await axios.get(`/colaborador/${id}`, {
        headers: { Authorization: `${token}` },
      });

      const utilizador = response.data;

      const primeiroNome = utilizador.nome.split(" ")[0];
      const ultimoNome = utilizador.nome.split(" ").slice(1).join(" ");

      setFormData({
        primeiroNome: primeiroNome || "",
        ultimoNome: ultimoNome || "",
        username: utilizador.username || "",
        dataNasc: utilizador.data_nasc || "",
        email: utilizador.email || "",
        telefone: utilizador.telefone || "",
        departamento: utilizador.departamento || "",
        cargo: utilizador.cargo || "",
        //receberEmails: utilizador.receber_emails || false,
        //notificacoesForum: utilizador.notificacoes_forum || false,
      });
    } catch (error) {
      console.error("Erro ao buscar dados do colaborador", error);
    }
  };

  const handleGuardar = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const id = sessionStorage.getItem("colaboradorid");

      const payload = {
        ...formData,
        nome: `${formData.primeiroNome} ${formData.ultimoNome}`.trim(),
      };

      delete payload.primeiroNome;
      delete payload.ultimoNome;

      await axios.put(`/colaborador/atualizar/${id}`, payload, {
        headers: { Authorization: `${token}` },
      });

      alert("Perfil atualizado com sucesso!");
      if (onSave) onSave(payload);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      alert("Erro ao atualizar perfil.");
    }
  };

  useEffect(() => {
    if (show && initialData?.id) {
      fetchData();
    }
  }, [show, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <ModalCustom show={show} handleClose={onClose} title="Editar Utilizador" size="xl">
      <Row className="justify-content-start mb-4">
        <Col md={12}>
          <div className="border p-4 shadow-sm rounded">
            <Row className="mb-3 align-items-center">
              <Col xs={4} sm={3} md={2} className="d-flex justify-content-center">
                <img src={profilePic} alt="Foto de Perfil" className="rounded-circle shadow-lg"
                  width="120" height="120" style={{ objectFit: "cover" }}/>
              </Col>
              <Col xs={8} sm={9} md={10}>
                <h5 className="mt-3 perfil-nome">
                  {initialData.nome || "Sem nome para mostrar"}
                </h5>
                <p>{initialData.funcao || "Sem dados"}</p>
              </Col>
            </Row>

            <hr />

            <Row className="mb-3">
              <InputField label="Primeiro Nome" name="primeiroNome" value={formData.primeiroNome} onChange={handleChange} colSize={6} />
              <InputField label="Último Nome" name="ultimoNome" value={formData.ultimoNome} onChange={handleChange} colSize={6} />
            </Row>

            <Row className="mb-3">
              <InputField label="Nome Utilizador" name="username" value={formData.username} onChange={handleChange} icon={<FaUser />} colSize={6} />
              <InputField label="Data Nascimento" name="dataNasc" value={formData.dataNasc} type="date" icon={<IoCalendarNumberSharp />} colSize={6} disabled readOnly />
            </Row>

            <Row className="mb-3">
              <InputField label="Email" name="email" value={formData.email} onChange={handleChange} icon={<MdEmail />} colSize={6} />
              <InputField label="Número Telemóvel" name="telefone" value={formData.telefone} onChange={handleChange} icon={<FaMobileAlt />} colSize={6} />
            </Row>

            <Row className="mb-3">
              <InputField label="Departamento" name="departamento" value={formData.departamento} onChange={handleChange} icon={<FaBuilding />} colSize={6} disabled readOnly/>
              <InputField label="Cargo" name="cargo" value={formData.cargo} onChange={handleChange} colSize={6} disabled readOnly/>
            </Row>

            <Row className="mb-3">
              <InputField label="Sobre Mim" name="sobre_mim" value={formData.sobre_mim} onChange={handleChange} type="textarea" rows={5} style={{ resize: "none" }} colSize={12} />
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <strong>Notificações</strong>
                  <Form.Check type="switch" id="receberEmails" label="Receber e-mails promocionais"
                    name="receberEmails" checked={formData.receberEmails} onChange={handleChange} className="form-switch" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Check type="switch" id="notificacoesForum" label="Notificações do Fórum"
                    name="notificacoesForum" checked={formData.notificacoesForum} onChange={handleChange} className="form-switch" />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-center mt-4">
              <Cancelar text={"Cancelar"} onClick={() => alert("Botão Cancelar clicado")} Icon={BsArrowReturnLeft} inline={true} />
              <Guardar text={"Guardar"} onClick={handleGuardar} Icon={FaRegSave} />
            </div>
          </div>
        </Col>
      </Row>
    </ModalCustom>
  );
};
