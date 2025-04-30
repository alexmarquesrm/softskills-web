import React, { useState, useEffect } from "react";
import axios from "../../config/configAxios";
import { Form, Col, Row, Container } from "react-bootstrap";
/* COMPONENTES */
import Guardar from "../../components/buttons/saveButton";
import InputField from "../../components/textFields/basic";
import Cancelar from "../../components/buttons/cancelButton";
import DropdownCheckbox from "../../components/dropdown/dropdown";
/* MODALS */
import ModalCustom from "../modalCustom";
/* ICONS */
import { FaRegSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobileAlt, FaUser, FaBuilding } from "react-icons/fa";
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
        telefone: telemovel ,
        departamento,
        cargo,
        inativo: !ativo,
        tipo: tipoUtilizador[0], 
      };

      console.log("Novo Colaborador:", novoColaborador); 
      await axios.post(`/colaborador/adicionar`, novoColaborador, {
        headers: { Authorization: `${token}` },
      });

    } catch (error) {
      console.error("Erro ao criar perfil", error);
      alert("Erro ao atualizar perfil."); 
    }

    alert("Perfil criado com sucesso!");
    resetForm();
    onClose();
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
    setAtivo(false);
  };

  const handleCancel = () => {
    resetForm();
    // setEmailError(false);
    // setPnomeError(false);
    // setUnomeError(false);
    // setPassError(false);
    // setPoloError(false);
    // setPerfilError(false);
    // setDepartamentoError(false);
    // setFuncaoError(false);
    // setPoloAdmError(false);
    onClose();
  };

  return (
    <ModalCustom show={show} handleClose={onClose} title="Adicionar Utilizador" size="xl" >
      <Container className="mt-3">
        <Row className="justify-content-start mb-4">
          <Col md={12}>
            <div className="border p-4 shadow-sm rounded"  style={{ backgroundColor: "#fff" }}>

              <Row className="mb-3">
                <InputField label="Primeiro Nome" type="text" name="Pnome" value={Pnome} onChange={(e) => setPnome(e.target.value)} colSize={6} />
                <InputField label="Último Nome" type="text" name="Unome" value={Unome} onChange={(e) => setUnome(e.target.value)} colSize={6} />
              </Row>

              <Row className="mb-3">
                <InputField label="Nome Utilizador" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} icon={<FaUser />} colSize={6} />
                <InputField label="Data Nascimento" type="date" name="data" value={data} onChange={(e) => setData(e.target.value)} icon={<IoCalendarNumberSharp />} colSize={6} />
              </Row>

              <Row className="mb-3">
                <InputField label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<MdEmail />} colSize={6} />
                <InputField label="Número Telemóvel" type="tel" name="telemovel" value={telemovel} onChange={(e) => setTelemovel(e.target.value)} icon={<FaMobileAlt />} colSize={6} />
              </Row>

              <Row className="mb-3">
                <InputField label="Departamento" type="text" name="departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} icon={<FaBuilding />} colSize={6} />
                <InputField label="Cargo" type="text" name="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} colSize={6} />
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
                <Cancelar text={"Cancelar"} onClick={handleCancel} Icon={BsArrowReturnLeft} inline={true} />
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
