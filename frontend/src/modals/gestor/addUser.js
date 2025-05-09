import React, { useState, useEffect } from "react";
import axios from "../../config/configAxios";
import { Form, Col, Row, Container, Card } from "react-bootstrap";
/* COMPONENTES */
import Guardar from "../../components/buttons/saveButton";
import InputField from "../../components/textFields/basic";
import Cancelar from "../../components/buttons/cancelButton";
/* MODALS */
import ModalCustom from "../modalCustom";
/* ICONS */
import { FaRegSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobileAlt, FaUser, FaBuilding, FaUserTie, FaUserGraduate } from "react-icons/fa";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { BsArrowReturnLeft } from "react-icons/bs";

const ModalAddUser = ({ show, onClose }) => {
  const [Pnome, setPnome] = useState('');
  const [Unome, setUnome] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState(''); 
  const [username, setUsername] = useState('');
  const [data, setData] = useState('');
  const [email, setEmail] = useState('');
  const [telemovel, setTelemovel] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [cargo, setCargo] = useState();
  const [ativo, setAtivo] = useState(true);
  const [tipoUtilizador, setTipoUtilizador] = useState([]);

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const nomeCompleto = `${Pnome} ${Unome}`;
      
      if (!tipoUtilizador.length) {
        alert("Por favor selecione um tipo de utilizador (Formando ou Formador)");
        return;
      }

      const novoColaborador = {
        nome: nomeCompleto,
        username,
        data_nasc: data,
        email,
        telefone: telemovel,
        departamento,
        cargo,
        inativo: !ativo,
        tipo: tipoUtilizador[0], 
      };

      await axios.post(`/colaborador/adicionar`, novoColaborador, {
        headers: { Authorization: `${token}` },
      });

      alert("Perfil criado com sucesso!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erro ao criar perfil", error);
      alert("Erro ao atualizar perfil."); 
    }
  };

  const resetForm = () => {
    setPnome('');
    setUnome('');
    setEmail('');
    setData('');
    setTelemovel('');
    setUsername('');
    setDepartamento('');
    setCargo('');
    setAtivo(true);
    setTipoUtilizador([]);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleTipoChange = (tipo) => {
    setTipoUtilizador(prev => {
      if (prev.includes(tipo)) {
        return prev.filter(t => t !== tipo);
      } else {
        return [...prev, tipo];
      }
    });
  };

  return (
    <ModalCustom show={show} handleClose={onClose} title="Adicionar Utilizador" size="xl">
      <Container className="mt-3">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <Row className="mb-4">
              <Col md={12}>
                <h5 className="text-primary mb-3">Informações Pessoais</h5>
                <Row className="mb-3">
                  <InputField 
                    label="Primeiro Nome" 
                    type="text" 
                    name="Pnome" 
                    value={Pnome} 
                    onChange={(e) => setPnome(e.target.value)} 
                    colSize={6} 
                  />
                  <InputField 
                    label="Último Nome" 
                    type="text" 
                    name="Unome" 
                    value={Unome} 
                    onChange={(e) => setUnome(e.target.value)} 
                    colSize={6} 
                  />
                </Row>

                <Row className="mb-3">
                  <InputField 
                    label="Nome Utilizador" 
                    type="text" 
                    name="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    icon={<FaUser />} 
                    colSize={6} 
                  />
                  <InputField 
                    label="Data Nascimento" 
                    type="date" 
                    name="data" 
                    value={data} 
                    onChange={(e) => setData(e.target.value)} 
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
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    icon={<MdEmail />} 
                    colSize={6} 
                  />
                  <InputField 
                    label="Número Telemóvel" 
                    type="tel" 
                    name="telemovel" 
                    value={telemovel} 
                    onChange={(e) => setTelemovel(e.target.value)} 
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
                    type="text" 
                    name="departamento" 
                    value={departamento} 
                    onChange={(e) => setDepartamento(e.target.value)} 
                    icon={<FaBuilding />} 
                    colSize={6} 
                  />
                  <InputField 
                    label="Cargo" 
                    type="text" 
                    name="cargo" 
                    value={cargo} 
                    onChange={(e) => setCargo(e.target.value)} 
                    colSize={6} 
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
                          checked={tipoUtilizador.includes("Formando")}
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
                          checked={tipoUtilizador.includes("Formador")}
                          onChange={() => handleTipoChange("Formador")}
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
                          <span className={ativo ? "text-success" : "text-danger"}>
                            {ativo ? "Conta Ativa" : "Conta Inativa"}
                          </span>
                        </div>
                      }
                      checked={ativo}
                      onChange={() => setAtivo(!ativo)}
                      className="mt-1"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <Cancelar text="Cancelar" onClick={handleCancel} Icon={BsArrowReturnLeft} inline={true} />
              <Guardar text="Criar Utilizador" onClick={handleSave} Icon={FaRegSave} />
            </div>
          </Card.Body>
        </Card>
      </Container>
    </ModalCustom>
  );
};

export default ModalAddUser;
