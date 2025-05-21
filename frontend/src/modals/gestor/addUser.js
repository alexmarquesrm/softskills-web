import React, { useState, useEffect } from "react";
import axios from "../../config/configAxios";
import { Form, Col, Row, Container, Card, Alert, Spinner } from "react-bootstrap";
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

const ModalAddUser = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    Pnome: '',
    Unome: '',
    username: '',
    data: '',
    email: '',
    telemovel: '',
    departamentoId: '',
    funcaoId: '',
    ativo: true,
    tipoUtilizador: []
  });
  
  const [departamentos, setDepartamentos] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Load departments and functions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResponse, funcResponse] = await Promise.all([
          axios.get('/departamento'),
          axios.get('/funcao')
        ]);
        setDepartamentos(deptResponse.data);
        setFuncoes(funcResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Não foi possível carregar os dados necessários. Por favor, tente novamente.");
      }
    };

    if (show) {
      fetchData();
    }
  }, [show]);

  // Filter functions based on selected department
  const funcoesFiltradas = funcoes.filter(funcao => 
    formData.departamentoId ? funcao.departamento_id === parseInt(formData.departamentoId) : true
  );

  const validateForm = () => {
    const errors = {};
    
    if (!formData.Pnome.trim()) errors.Pnome = "Primeiro nome é obrigatório";
    if (!formData.Unome.trim()) errors.Unome = "Último nome é obrigatório";
    if (!formData.username.trim()) errors.username = "Nome de utilizador é obrigatório";
    if (!formData.email.trim()) errors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email inválido";
    if (!formData.data) errors.data = "Data de nascimento é obrigatória";
    if (!formData.departamentoId) errors.departamentoId = "Departamento é obrigatório";
    if (!formData.funcaoId) errors.funcaoId = "Função é obrigatória";
    if (formData.tipoUtilizador.length === 0) errors.tipoUtilizador = "Selecione pelo menos um tipo de utilizador";

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
      
      const novoColaborador = {
        nome: nomeCompleto,
        username: formData.username,
        data_nasc: formData.data,
        email: formData.email,
        telefone: formData.telemovel,
        funcao_id: parseInt(formData.funcaoId),
        inativo: !formData.ativo,
        tipo: formData.tipoUtilizador[0]
      };

      await axios.post(`/colaborador/adicionar`, novoColaborador, {
        headers: { Authorization: `${token}` }
      });

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar perfil", error);
      setError(error.response?.data?.message || "Erro ao criar perfil. Por favor, tente novamente.");
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
      departamentoId: '',
      funcaoId: '',
      ativo: true,
      tipoUtilizador: []
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

  const handleTipoChange = (tipo) => {
    setFormData(prev => ({
      ...prev,
      tipoUtilizador: prev.tipoUtilizador.includes(tipo)
        ? prev.tipoUtilizador.filter(t => t !== tipo)
        : [...prev.tipoUtilizador, tipo]
    }));
    if (validationErrors.tipoUtilizador) {
      setValidationErrors(prev => ({
        ...prev,
        tipoUtilizador: undefined
      }));
    }
  };

  const handleDepartamentoChange = (e) => {
    const deptId = e.target.value;
    setFormData(prev => ({
      ...prev,
      departamentoId: deptId,
      funcaoId: '' // Reset function when department changes
    }));
    if (validationErrors.departamentoId) {
      setValidationErrors(prev => ({
        ...prev,
        departamentoId: undefined
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
                  label="Nome Utilizador" 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange}
                  error={validationErrors.username}
                  icon={<FaUser />} 
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
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Departamento</Form.Label>
                    <Form.Select
                      name="departamentoId"
                      value={formData.departamentoId}
                      onChange={handleDepartamentoChange}
                      className={validationErrors.departamentoId ? "is-invalid" : ""}
                    >
                      <option value="">Selecione um departamento</option>
                      {departamentos.map(dept => (
                        <option key={dept.departamento_id} value={dept.departamento_id}>
                          {dept.nome}
                        </option>
                      ))}
                    </Form.Select>
                    {validationErrors.departamentoId && (
                      <div className="invalid-feedback">{validationErrors.departamentoId}</div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Função</Form.Label>
                    <Form.Select
                      name="funcaoId"
                      value={formData.funcaoId}
                      onChange={handleChange}
                      className={validationErrors.funcaoId ? "is-invalid" : ""}
                      disabled={!formData.departamentoId}
                    >
                      <option value="">Selecione uma função</option>
                      {funcoesFiltradas.map(func => (
                        <option key={func.funcao_id} value={func.funcao_id}>
                          {func.nome}
                        </option>
                      ))}
                    </Form.Select>
                    {validationErrors.funcaoId && (
                      <div className="invalid-feedback">{validationErrors.funcaoId}</div>
                    )}
                  </Form.Group>
                </Col>
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
                        checked={formData.tipoUtilizador.includes("Formando")}
                        onChange={() => handleTipoChange("Formando")}
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
                        checked={formData.tipoUtilizador.includes("Formador")}
                        onChange={() => handleTipoChange("Formador")}
                      />
                    </div>
                    {validationErrors.tipoUtilizador && (
                      <div className="text-danger mt-1">{validationErrors.tipoUtilizador}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <Form.Check 
                    type="switch" 
                    id="ativoSwitch" 
                    label={
                      <div className="d-flex align-items-center">
                        <span className={formData.ativo ? "text-success" : "text-danger"}>
                          {formData.ativo ? "Conta Ativa" : "Conta Inativa"}
                        </span>
                      </div>
                    }
                    checked={formData.ativo}
                    onChange={() => setFormData(prev => ({ ...prev, ativo: !prev.ativo }))}
                    className="mt-4"
                  />
                </Col>
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

export default ModalAddUser;
