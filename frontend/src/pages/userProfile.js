import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import axios from "../config/configAxios";
import { FaUser, FaBuilding, FaUserTie, FaUserGraduate, FaMobileAlt, FaEnvelope } from "react-icons/fa";
import { IoCalendarNumberSharp } from "react-icons/io5";
import EditProfile from "../modals/gestor/editUser";

export default function UserProfile() {
  const [userData, setUserData] = useState({
    nome: "",
    username: "",
    data_nasc: "",
    email: "",
    telefone: "",
    funcao_id: "",
    tipo: "",
    inativo: false,
    fotoPerfilUrl: ""
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("/colaborador/perfil", {
          headers: { Authorization: `${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

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

    fetchUserData();
    fetchDepartamentos();
    fetchFuncoes();
  }, []);

  const getFuncaoInfo = () => {
    const funcao = funcoes.find(f => f.funcao_id === userData.funcao_id);
    if (!funcao) return { nome: "N/A", departamento: "N/A" };

    const departamento = departamentos.find(d => d.departamento_id === funcao.departamento_id);
    return {
      nome: funcao.nome,
      departamento: departamento ? departamento.nome : "N/A"
    };
  };

  const getTipoIcon = () => {
    switch (userData.tipo?.toLowerCase()) {
      case "formador":
        return <FaUserTie className="text-primary" />;
      case "formando":
        return <FaUserGraduate className="text-primary" />;
      case "gestor":
        return <FaUser className="text-primary" />;
      default:
        return <FaUser className="text-primary" />;
    }
  };

  const handleSave = async (updatedData) => {
    setUserData(updatedData);
    setShowEditModal(false);
  };

  return (
    <div className="container py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <img
                  src={userData.fotoPerfilUrl || "/default-avatar.png"}
                  alt="Foto de Perfil"
                  className="rounded-circle"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <h3 className="mt-3">{userData.nome}</h3>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  {getTipoIcon()}
                  <span className="text-muted">{userData.tipo}</span>
                </div>
              </div>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted">Username</label>
                    <div className="d-flex align-items-center">
                      <FaUser className="me-2 text-primary" />
                      <span>{userData.username}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted">Data de Nascimento</label>
                    <div className="d-flex align-items-center">
                      <IoCalendarNumberSharp className="me-2 text-primary" />
                      <span>{new Date(userData.data_nasc).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted">Email</label>
                    <div className="d-flex align-items-center">
                      <FaEnvelope className="me-2 text-primary" />
                      <span>{userData.email}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted">Telefone</label>
                    <div className="d-flex align-items-center">
                      <FaMobileAlt className="me-2 text-primary" />
                      <span>{userData.telefone}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted">Departamento</label>
                    <div className="d-flex align-items-center">
                      <FaBuilding className="me-2 text-primary" />
                      <span>{getFuncaoInfo().departamento}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label text-muted">Função</label>
                    <div className="d-flex align-items-center">
                      <FaUserTie className="me-2 text-primary" />
                      <span>{getFuncaoInfo().nome}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowEditModal(true)}
                >
                  Editar Perfil
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <EditProfile
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        initialData={userData}
      />
    </div>
  );
} 