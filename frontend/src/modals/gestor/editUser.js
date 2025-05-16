import React, { useState, useEffect } from "react";
import axios from "../../config/configAxios";
import { Row, Col, Form, Card } from "react-bootstrap";
import profilePic from "../../logo.svg";
/* COMPONENTES */
import Guardar from "../../components/buttons/saveButton";
import InputField from "../../components/textFields/basic";
import Cancelar from "../../components/buttons/cancelButton";
/* MODALS */
import ModalCustom from "../modalCustom";
/* ICONS */
import { FaRegSave, FaMobileAlt, FaUser, FaBuilding, FaUserTie, FaUserGraduate } from "react-icons/fa";
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
    tipo: "",
    inativo: false,
    fotoPerfilUrl: ""
  });

  const [previewFoto, setPreviewFoto] = useState(profilePic);

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
        tipo: utilizador.tipo || "",
        inativo: utilizador.inativo || false,
        fotoPerfilUrl: utilizador.fotoPerfilUrl || ""
      });

      if (utilizador.fotoPerfilUrl) {
        setPreviewFoto(utilizador.fotoPerfilUrl);
      }
    } catch (error) {
      console.error("Erro ao procurar dados do colaborador", error);
    }
  };

  const handleGuardar = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const id = initialData.id;

      const payload = {
        ...formData,
        nome: `${formData.primeiroNome} ${formData.ultimoNome}`.trim(),
        data_nasc: formData.dataNasc,
      };

      delete payload.primeiroNome;
      delete payload.ultimoNome;
      delete payload.dataNasc;
      
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
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="mb-4 align-items-center">
            <Col xs={4} sm={3} md={2} className="d-flex justify-content-center">
              <img 
                src={previewFoto} 
                alt="Foto de Perfil" 
                className="rounded-circle shadow-lg"
                width="120" 
                height="120" 
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = profilePic;
                }}
              />
            </Col>
            <Col xs={8} sm={9} md={10}>
              <h5 className="text-primary mb-2">
                {initialData.nome || "Sem nome para mostrar"}
              </h5>
              <p className="text-muted mb-0">{initialData.funcao || "Sem dados"}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <h5 className="text-primary mb-3">Informações Pessoais</h5>
              <Row className="mb-3">
                <InputField 
                  label="Primeiro Nome" 
                  name="primeiroNome" 
                  value={formData.primeiroNome} 
                  onChange={handleChange} 
                  colSize={6} 
                />
                <InputField 
                  label="Último Nome" 
                  name="ultimoNome" 
                  value={formData.ultimoNome} 
                  onChange={handleChange} 
                  colSize={6} 
                />
              </Row>

              <Row className="mb-3">
                <InputField 
                  label="Nome Utilizador" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  icon={<FaUser />} 
                  colSize={6} 
                />
                <InputField 
                  label="Data Nascimento" 
                  name="dataNasc" 
                  value={formData.dataNasc} 
                  type="date" 
                  icon={<IoCalendarNumberSharp />} 
                  colSize={6} 
                  disabled 
                  readOnly 
                />
              </Row>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <h5 className="text-primary mb-3">Informações de Contacto</h5>
              <Row className="mb-3">
                <InputField 
                  label="Email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  icon={<MdEmail />} 
                  colSize={6} 
                />
                <InputField 
                  label="Número Telemóvel" 
                  name="telefone" 
                  value={formData.telefone} 
                  onChange={handleChange} 
                  icon={<FaMobileAlt />} 
                  colSize={6} 
                />
              </Row>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <h5 className="text-primary mb-3">Informações Profissionais</h5>
              <Row className="mb-3">
                <InputField 
                  label="Departamento" 
                  name="departamento" 
                  value={formData.departamento} 
                  onChange={handleChange} 
                  icon={<FaBuilding />} 
                  colSize={6} 
                  disabled 
                  readOnly
                />
                <InputField 
                  label="Cargo" 
                  name="cargo" 
                  value={formData.cargo} 
                  onChange={handleChange} 
                  colSize={6} 
                  disabled 
                  readOnly
                />
              </Row>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <h5 className="text-primary mb-3">Configurações da Conta</h5>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Tipo de Utilizador</label>
                    <div className="d-flex gap-4">
                      <Form.Check
                        type="checkbox"
                        id="formando"
                        label={
                          <div className="d-flex align-items-center">
                            <FaUserGraduate className="me-2 text-primary" />
                            <span>Formando</span>
                          </div>
                        }
                        checked={formData.tipo === "Formando"}
                        onChange={() => setFormData({...formData, tipo: "Formando"})}
                      />
                      <Form.Check
                        type="checkbox"
                        id="formador"
                        label={
                          <div className="d-flex align-items-center">
                            <FaUserTie className="me-2 text-primary" />
                            <span>Formador</span>
                          </div>
                        }
                        checked={formData.tipo === "Formador"}
                        onChange={() => setFormData({...formData, tipo: "Formador"})}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <Form.Check 
                    type="switch" 
                    id="ativoSwitch" 
                    label={
                      <div className="d-flex align-items-center">
                        <span className={!formData.inativo ? "text-success" : "text-danger"}>
                          {!formData.inativo ? "Conta Ativa" : "Conta Inativa"}
                        </span>
                      </div>
                    }
                    checked={!formData.inativo}
                    onChange={() => setFormData({...formData, inativo: !formData.inativo})}
                    className="mt-1"
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Cancelar text="Cancelar" onClick={onClose} Icon={BsArrowReturnLeft} inline={true} />
            <Guardar text="Guardar Alterações" onClick={handleGuardar} Icon={FaRegSave} />
          </div>
        </Card.Body>
      </Card>
    </ModalCustom>
  );
};
