import React, { useState, useEffect } from "react";
import axios from "../config/configAxios";
import { Form, Col, Row, Card, Alert, Spinner } from "react-bootstrap";
/* COMPONENTES */
import Guardar from "../components/buttons/saveButton";
import InputField from "../components/textFields/basic";
import Cancelar from "../components/buttons/cancelButton";
/* MODALS */
import ModalCustom from "./modalCustom";
/* ICONS */
import { FaRegSave, FaMobileAlt, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { BsArrowReturnLeft } from "react-icons/bs";

const ModalRegisterUser = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    Pnome: '',
    Unome: '',
    username: '',
    data: '',
    email: '',
    telemovel: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
  const p = formData.Pnome.trim();
  const u = formData.Unome.trim();

  if (p && u) {
    const usernameSugerido = `${p}.${u}`.replace(/\s+/g, '').toLowerCase();
    setFormData((prev) => ({
      ...prev,
      username: usernameSugerido,
    }));
  }
}, [formData.Pnome, formData.Unome]);



  const validateForm = () => {
  const errors = {};

  // Primeiro nome obrigatório
  if (!formData.Pnome.trim()) errors.Pnome = "Primeiro nome é obrigatório";

  // Último nome obrigatório
  if (!formData.Unome.trim()) errors.Unome = "Último nome é obrigatório";

  // Email obrigatório e formato válido
  if (!formData.email.trim()) errors.email = "Email é obrigatório";
  else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email inválido";

  // Data de nascimento obrigatória
  if (!formData.data) errors.data = "Data de nascimento é obrigatória";

  // Password obrigatório e com um mínimo de 6 caracteres (ajusta conforme quiseres)
  if (!formData.password.trim()) errors.password = "Password é obrigatória";
  else if (formData.password.length <= 2) errors.password = "Password deve ter pelo menos 3 caracteres";

  // Telemóvel obrigatório e válido (ex: mínimo 9 dígitos)
  const telefone = formData.telemovel.trim();
  if (!telefone) errors.telemovel = "Número de telemóvel é obrigatório";
  else if (!/^\d{9,}$/.test(telefone)) errors.telemovel = "Número de telemóvel inválido";

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};


  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = sessionStorage.getItem("token");
      const nomeCompleto = `${formData.Pnome} ${formData.Unome}`;

      // Preparar o payload conforme esperado pelo backend
      const novoColaborador = {
        nome: nomeCompleto,
        username: formData.username,
        data_nasc: formData.data,
        email: formData.email,
        telefone: parseInt(formData.telemovel),
        sobre_mim: '',
        score: 0,
        password: formData.password,
      };

      await axios.post(`/colaborador/registo`, novoColaborador, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar perfil", error);
      console.error("Detalhes do erro:", error.response?.data);
      console.error("Stack trace:", error.stack);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Erro ao criar perfil. Por favor, tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Pnome: '',
      Unome: '',
      username: '',
      data: '',
      email: '',
      telemovel: '',
    });
    setValidationErrors({});
    setError(null);
    setSuccess(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };


  return (
    <ModalCustom show={show} handleClose={onClose} title="Adicionar Utilizador" size="xl">
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          {success && <Alert variant="success" className="mb-4">Utilizador criado com sucesso!</Alert>}

          <Row className="mb-4">
            <Col md={12}>
              <h5 className="text-primary mb-3">Informações Pessoais</h5>
              <Row className="mb-3">
                <InputField
                  label="Primeiro Nome"
                  type="text"
                  name="Pnome"
                  value={formData.Pnome}
                  onChange={handleChange}
                  error={validationErrors.Pnome}
                  colSize={6}
                />
                <InputField
                  label="Último Nome"
                  type="text"
                  name="Unome"
                  value={formData.Unome}
                  onChange={handleChange}
                  error={validationErrors.Unome}
                  colSize={6}
                />
              </Row>

              <Row className="mb-3">
                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={validationErrors.password}
                  colSize={6}
                />
                <InputField
                  label="Data Nascimento"
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  error={validationErrors.data}
                  icon={<IoCalendarNumberSharp />}
                  colSize={6}
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
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={validationErrors.email}
                  icon={<MdEmail />}
                  colSize={6}
                />
                <InputField
                  label="Número Telemóvel"
                  type="tel"
                  name="telemovel"
                  value={formData.telemovel}
                  onChange={handleChange}
                  error={validationErrors.telemovel}
                  icon={<FaMobileAlt />}
                  colSize={6}
                />
              </Row>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Cancelar text="Cancelar" onClick={handleCancel} Icon={BsArrowReturnLeft} inline={true} />
            <Guardar
              text={loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  A criar...
                </>
              ) : "Criar Utilizador"}
              onClick={handleSave}
              Icon={FaRegSave}
              disabled={loading}
            />
          </div>
        </Card.Body>
      </Card>
    </ModalCustom>
  );
};

export default ModalRegisterUser;
