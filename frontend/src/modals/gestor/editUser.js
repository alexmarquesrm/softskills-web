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
    funcao_id: "",
    tipo: "",
    inativo: false,
    fotoPerfilUrl: ""
  });

  const [previewFoto, setPreviewFoto] = useState(profilePic);
  const [departamentos, setDepartamentos] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [departamentoAtual, setDepartamentoAtual] = useState(null);
  const [funcaoNome, setFuncaoNome] = useState("");

  // Carregar departamentos e funções
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get('/departamento');
        setDepartamentos(response.data);
      } catch (error) {
        console.error("Erro ao carregar departamentos:", error);
      }
    };

    const fetchFuncoes = async () => {
      try {
        const response = await axios.get('/funcao');
        setFuncoes(response.data);
      } catch (error) {
        console.error("Erro ao carregar funções:", error);
      }
    };

    if (show) {
      fetchDepartamentos();
      fetchFuncoes();
    }
  }, [show]);

  // Filtrar funções baseado no departamento atual
  const funcoesFiltradas = funcoes.filter(funcao => 
    departamentoAtual ? funcao.departamento_id === departamentoAtual : true
  );

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

      // Encontrar o departamento atual baseado na função
      let departamentoAtualId = null;
      if (utilizador.funcao_id) {
        try {
          const funcaoResponse = await axios.get(`/funcao/${utilizador.funcao_id}`);
          if (funcaoResponse.data) {
            departamentoAtualId = funcaoResponse.data.departamento_id;
            setFuncaoNome(funcaoResponse.data.nome); // Armazenar o nome da função
          }
        } catch (error) {
          console.error("Erro ao buprocurarscar dados da função:", error);
        }
      }

      setDepartamentoAtual(departamentoAtualId);

      setFormData({
        primeiroNome: primeiroNome || "",
        ultimoNome: ultimoNome || "",
        username: utilizador.username || "",
        dataNasc: utilizador.data_nasc || "",
        email: utilizador.email || "",
        telefone: utilizador.telefone || "",
        funcao_id: utilizador.funcao_id || "",
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

  const handleDepartamentoChange = (e) => {
    const deptId = parseInt(e.target.value);
    setDepartamentoAtual(deptId);
    setFormData(prev => ({
      ...prev,
      funcao_id: "" // Reset função quando departamento muda
    }));
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
                    icon={<FaUser />}
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Último Nome"
                    name="ultimoNome"
                    value={formData.ultimoNome}
                    onChange={handleChange}
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
                      className="form-control"
                    >
                      <option value="">Selecione um departamento</option>
                      {departamentos.map(dept => (
                        <option key={dept.departamento_id} value={dept.departamento_id}>
                          {dept.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Função</Form.Label>
                    <Form.Select
                      value={formData.funcao_id}
                      onChange={(e) => setFormData({...formData, funcao_id: e.target.value})}
                      className="form-control"
                      disabled={!departamentoAtual}
                    >
                      <option value="">Selecione uma função</option>
                      {funcoesFiltradas.map(func => (
                        <option key={func.funcao_id} value={func.funcao_id}>
                          {func.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <h5 className="text-primary mb-3">Tipo de Utilizador</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="gestor">Gestor</option>
                      <option value="formador">Formador</option>
                      <option value="formando">Formando</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mt-4">
                    <Form.Check
                      type="checkbox"
                      label="Inativo"
                      name="inativo"
                      checked={formData.inativo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Cancelar text="Cancelar" onClick={onClose} Icon={BsArrowReturnLeft} inline={true} />
            <Guardar text="Guardar" onClick={handleGuardar} Icon={FaRegSave} />
          </div>
        </Card.Body>
      </Card>
    </ModalCustom>
  );
}
