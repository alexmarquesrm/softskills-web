import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/configAxios";
import { Container, Row, Col, Form } from "react-bootstrap";
import profilePic from "../../logo.svg";

// COMPONENTES
import Guardar from "../../components/buttons/saveButton";
import InputField from "../../components/textFields/basic";
import Cancelar from "../../components/buttons/cancelButton";
import  "../../modals/modalCustom";

// ICONS
import { FaRegSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobileAlt, FaUser, FaLock } from "react-icons/fa";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";
import { BsArrowReturnLeft } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function EditColab (){
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    primeiroNome: "",
    ultimoNome: "",
    username: "",
    dataNasc: "",
    email: "",
    telefone: "",
    departamento: "",
    cargo: "",
    sobre_mim: "",
    novaPassword: "",
    confirmarPassword: "",
    receberEmails: false,
    notificacoesForum: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const id = sessionStorage.getItem("colaboradorid");

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
        sobre_mim: utilizador.sobre_mim || "",
        novaPassword: "",
        confirmarPassword: "",
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

      if (formData.novaPassword || formData.confirmarPassword) {
        if (formData.novaPassword !== formData.confirmarPassword) {
          alert("As palavras-passe não coincidem.");
          return;
        }
      }

      const payload = {
        ...formData,
        nome: `${formData.primeiroNome} ${formData.ultimoNome}`.trim(),
      };

      if (formData.novaPassword) {
        payload.pssword = formData.novaPassword;
      }

      delete payload.confirmarPassword;
      delete payload.primeiroNome;
      delete payload.ultimoNome;

      await axios.put(`/colaborador/atualizar/${id}`, payload, {
        headers: { Authorization: `${token}` },
      });

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      alert("Erro ao atualizar perfil.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <h2 className="form-title">Perfil Utilizador</h2>
        </Col>
      </Row>

      <Row className="justify-content-start mb-4">
        <Col md={12}>
          <div className="border p-4 shadow-sm rounded">
            <Row className="mb-3" style={{ alignItems: "center" }}>
              <Col xs={4} sm={3} md={2} className="text-center">
                <img
                  src={profilePic}
                  alt="Foto de Perfil"
                  className="rounded-circle perfil-img shadow-lg"
                  width="120"
                  height="120"
                  style={{ objectFit: "cover" }}
                />
              </Col>
              <Col xs={8} sm={9} md={10}>
                <h5 className="mt-3 perfil-nome">{formData.primeiroNome} {formData.ultimoNome}</h5>
                <p>{formData.cargo}</p>
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
              <InputField label="Nova Password" name="novaPassword" value={formData.novaPassword} onChange={handleChange}
                type={showPassword ? "text" : "password"} icon={<FaLock />} colSize={6}
                endIcon={showPassword ? <FaEyeSlash /> : <FaEye />} onEndIconClick={() => setShowPassword(!showPassword)} />

              <InputField label="Confirmar Password" name="confirmarPassword" value={formData.confirmarPassword} onChange={handleChange}
                type={showConfirmPassword ? "text" : "password"} icon={<FaLock />} colSize={6}
                endIcon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />} onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)} />
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
              <Cancelar text={"Cancelar"} onClick={() => navigate("/")} Icon={BsArrowReturnLeft} inline={true} />
              <Guardar text={"Guardar"} onClick={handleGuardar} Icon={FaRegSave} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

            //<Guardar
           // text={"Guardar"}
           // onClick={() => setShowModalEditar(true)}
            //Icon={FaRegSave}
            ///>
            //<ModalEditarPerfil show={showModalEditar} handleClose={() => setShowModalEditar(false)} />


                   
                   
                  