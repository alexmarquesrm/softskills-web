import React, { useState, useEffect } from "react";
import axios from "../../config/configAxios";
import { Row, Col, Form, Card, Alert, Spinner } from "react-bootstrap";
import { toast } from 'react-toastify';
import profilePic from "../../logo.svg";
/* COMPONENTES */
import Guardar from "../../components/buttons/saveButton";
import InputField from "../../components/textFields/basic";
import Cancelar from "../../components/buttons/cancelButton";
/* MODALS */
import ModalCustom from "../modalCustom";
/* ICONS */
import { FaRegSave, FaMobileAlt, FaUser, FaUserTie, FaUserGraduate } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { BsArrowReturnLeft, BsCheckCircle, } from "react-icons/bs";

export default function EditProfile({ show, onClose, onSave, initialData = {} }) {
  const [formData, setFormData] = useState({
    primeiroNome: "",
    ultimoNome: "",
    username: "",
    dataNasc: "",
    email: "",
    telefone: "",
    funcao_id: "",
    tipos: [],
    inativo: false,
    fotoPerfilUrl: ""
  });

  const [previewFoto, setPreviewFoto] = useState(profilePic);
  const [departamentos, setDepartamentos] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [departamentoAtual, setDepartamentoAtual] = useState(null);
  const [funcaoNome, setFuncaoNome] = useState("");
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

  // Filter functions based on current department
  const funcoesFiltradas = funcoes.filter(funcao =>
    departamentoAtual ? funcao.departamento_id === departamentoAtual : true
  );

  const validateForm = () => {
    const errors = {};

    if (!formData.primeiroNome.trim()) errors.primeiroNome = "Primeiro nome é obrigatório";
    if (!formData.ultimoNome.trim()) errors.ultimoNome = "Último nome é obrigatório";
    if (!formData.username.trim()) errors.username = "Nome de utilizador é obrigatório";
    if (!formData.email.trim()) errors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email inválido";
    if (!formData.dataNasc) errors.dataNasc = "Data de nascimento é obrigatória";
    if (!departamentoAtual) errors.departamentoAtual = "Departamento é obrigatório";
    if (!formData.funcao_id) errors.funcao_id = "Função é obrigatória";
    if (formData.tipos.length === 0) errors.tipos = "Selecione pelo menos um tipo de utilizador";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const id = initialData.id;

      const response = await axios.get(`/colaborador/${id}`, {
        headers: { Authorization: `${token}` }
      });
      const utilizador = response.data;
      const primeiroNome = utilizador.nome.split(" ")[0];
      const ultimoNome = utilizador.nome.split(" ").slice(1).join(" ");

      // Find current department based on function
      let departamentoAtualId = null;
      if (utilizador.funcao_id) {
        try {
          const funcaoResponse = await axios.get(`/funcao/${utilizador.funcao_id}`);
          if (funcaoResponse.data) {
            departamentoAtualId = funcaoResponse.data.departamento_id;
            setFuncaoNome(funcaoResponse.data.nome);
          }
        } catch (error) {
          console.error("Erro ao procurar dados da função:", error);
        }
      }

      setDepartamentoAtual(departamentoAtualId);

      // Get user types from the API response
      let tipos = [];

      // Se tiver tipos no response, usa ele
      if (utilizador.tipos && Array.isArray(utilizador.tipos)) {
        tipos = utilizador.tipos;
      }
      // Se não tiver tipos mas tiver tipo, converte para array
      else if (utilizador.tipo) {
        tipos = [utilizador.tipo];
      }

      setFormData({
        primeiroNome: primeiroNome || "",
        ultimoNome: ultimoNome || "",
        username: utilizador.username || "",
        dataNasc: utilizador.data_nasc || "",
        email: utilizador.email || "",
        telefone: utilizador.telefone || "",
        funcao_id: utilizador.funcao_id || "",
        tipos: tipos,
        inativo: utilizador.inativo || false,
        fotoPerfilUrl: utilizador.fotoPerfilUrl || ""
      });

      if (utilizador.fotoPerfilUrl) {
        setPreviewFoto(utilizador.fotoPerfilUrl);
      }
    } catch (error) {
      console.error("Erro ao procurar dados do colaborador", error);
      setError("Não foi possível carregar os dados do colaborador. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = sessionStorage.getItem("token");
      const id = initialData.id;

      // Encontrar a função e departamento selecionados
      const funcaoSelecionada = funcoes.find(f => f.funcao_id === parseInt(formData.funcao_id));
      const departamentoSelecionado = departamentos.find(d => d.departamento_id === departamentoAtual);

      const payload = {
        funcao_id: parseInt(formData.funcao_id),
        nome: `${formData.primeiroNome} ${formData.ultimoNome}`.trim(),
        username: formData.username,
        data_nasc: formData.dataNasc,
        email: formData.email,
        telefone: parseInt(formData.telefone),
        inativo: formData.inativo,
        tipos: formData.tipos,
        cargo: funcaoSelecionada?.nome || '',
        departamento: departamentoSelecionado?.nome || '',
        sobre_mim: formData.sobre_mim || '',
        score: formData.score || 0,
        especialidade: formData.tipos.includes("Formador") ? "Geral" : null
      };

      await axios.put(`/colaborador/atualizar/${id}`, payload, {
        headers: { Authorization: `${token}` }
      });
      toast.success("Utilizador atualizado com sucesso!");
      setSuccess(true);
      setTimeout(() => {
        if (onSave) onSave(payload);
        onClose();
      }, 200);
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      console.error("Erro ao atualizar perfil", error);
      console.error("Detalhes do erro:", error.response?.data);
      setError(error.response?.data?.message || "Erro ao atualizar perfil. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && initialData?.id) {
      fetchData();
    }
  }, [show, initialData]);

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

  const handleDepartamentoChange = (e) => {
    const deptId = parseInt(e.target.value);
    setDepartamentoAtual(deptId);
    setFormData(prev => ({
      ...prev,
      funcao_id: "" // Reset function when department changes
    }));
    if (validationErrors.departamentoAtual) {
      setValidationErrors(prev => ({
        ...prev,
        departamentoAtual: undefined
      }));
    }
  };

  const handleTipoChange = (tipo) => {
    setFormData(prev => ({
      ...prev,
      tipos: prev.tipos.includes(tipo)
        ? prev.tipos.filter(t => t !== tipo)
        : [...prev.tipos, tipo]
    }));
    if (validationErrors.tipos) {
      setValidationErrors(prev => ({
        ...prev,
        tipos: undefined
      }));
    }
  };

  if (loading && !formData.username) {
    return (
      <ModalCustom show={show} handleClose={onClose} title="Editar Utilizador" size="xl">
        <div className="d-flex justify-content-center align-items-center p-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">A carregar...</span>
          </Spinner>
          <p className="ms-3 mb-0">A carregar dados do utilizador...</p>
        </div>
      </ModalCustom>
    );
  }

  return (
    <ModalCustom show={show} handleClose={onClose} title="Editar Utilizador" size="xl">
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          {success && (
            <Alert variant="success" className="d-flex align-items-center mb-4">
              <BsCheckCircle className="me-2" />
              <span>Utilizador atualizado com sucesso!</span>
            </Alert>
          )}


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
              <p className="text-muted mb-0">{funcaoNome || "Sem dados"}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <h5 className="text-primary mb-3">Informações Pessoais</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <InputField
                    label="Primeiro Nome"
                    name="primeiroNome"
                    value={formData.primeiroNome}
                    onChange={handleChange}
                    error={validationErrors.primeiroNome}
                    icon={<FaUser />}
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Último Nome"
                    name="ultimoNome"
                    value={formData.ultimoNome}
                    onChange={handleChange}
                    error={validationErrors.ultimoNome}
                    icon={<FaUser />}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <InputField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={validationErrors.username}
                    icon={<FaUser />}
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Data de Nascimento"
                    name="dataNasc"
                    type="date"
                    value={formData.dataNasc}
                    onChange={handleChange}
                    error={validationErrors.dataNasc}
                    icon={<IoCalendarNumberSharp />}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={validationErrors.email}
                    icon={<MdEmail />}
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    icon={<FaMobileAlt />}
                  />
                </Col>
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
                      value={departamentoAtual || ""}
                      onChange={handleDepartamentoChange}
                      className={validationErrors.departamentoAtual ? "is-invalid" : ""}
                    >
                      <option value="">Selecione um departamento</option>
                      {departamentos.map(dept => (
                        <option key={dept.departamento_id} value={dept.departamento_id}>
                          {dept.nome}
                        </option>
                      ))}
                    </Form.Select>
                    {validationErrors.departamentoAtual && (
                      <div className="invalid-feedback">{validationErrors.departamentoAtual}</div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Função</Form.Label>
                    <Form.Select
                      name="funcao_id"
                      value={formData.funcao_id}
                      onChange={handleChange}
                      className={validationErrors.funcao_id ? "is-invalid" : ""}
                      disabled={!departamentoAtual}
                    >
                      <option value="">Selecione uma função</option>
                      {funcoesFiltradas.map(func => (
                        <option key={func.funcao_id} value={func.funcao_id}>
                          {func.nome}
                        </option>
                      ))}
                    </Form.Select>
                    {validationErrors.funcao_id && (
                      <div className="invalid-feedback">{validationErrors.funcao_id}</div>
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
                  <div className="border rounded p-3 h-100">
                    <label className="form-label fw-bold mb-2">Tipo de Utilizador</label>
                    <div className="d-flex flex-column gap-2">
                      <Form.Check
                        type="checkbox"
                        id="gestor"
                        label={
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-primary" />
                            <span>Gestor</span>
                          </div>
                        }
                        checked={formData.tipos.includes("Gestor")}
                        onChange={() => handleTipoChange("Gestor")}
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
                        checked={formData.tipos.includes("Formador")}
                        onChange={() => handleTipoChange("Formador")}
                      />
                      <Form.Check
                        type="checkbox"
                        id="formando"
                        label={
                          <div className="d-flex align-items-center">
                            <FaUserGraduate className="me-2 text-primary" />
                            <span>Formando</span>
                          </div>
                        }
                        checked={formData.tipos.includes("Formando")}
                        onChange={() => handleTipoChange("Formando")}
                      />
                    </div>
                    {validationErrors.tipos && (
                      <div className="text-danger mt-1">{validationErrors.tipos}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border rounded p-3 h-100">
                    <label className="form-label fw-bold mb-2">Estado da Conta</label>
                    <div className="d-flex align-items-center">
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
                        onChange={() => setFormData(prev => ({ ...prev, inativo: !prev.inativo }))}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Cancelar text="Cancelar" onClick={onClose} Icon={BsArrowReturnLeft} inline={true} />
            <Guardar
              text={loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  A guardar...
                </>
              ) : "Guardar"}
              onClick={handleGuardar}
              Icon={FaRegSave}
              disabled={loading}
            />
          </div>
        </Card.Body>
      </Card>
    </ModalCustom>
  );
}
