
import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import InputField from '../components/textFields/basic';
import DropdownCheckbox from '../components/dropdown/dropdown';
import { FaBook, FaClock } from 'react-icons/fa';
import ModalCustom from './ModalCustom'; 
import Cancelar from '../components/buttons/cancelButton'; 
import Guardar from '../components/buttons/saveButton'; 
import { BsArrowReturnLeft } from 'react-icons/bs';
import { LuSend } from 'react-icons/lu';

const ModalEditarPerfil = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({});
  const [categoria, setCategoria] = useState([]);
  const [area, setArea] = useState([]);
  const [topico, setTopico] = useState([]);
  const [dificuldade, setDificuldade] = useState([]);
  const [certificado, setCertificado] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = () => {
    
    alert('Dados enviados');
    handleClose();
  };

  return (
    <ModalCustom show={show} handleClose={handleClose} title="Pedir Curso" onSubmit={handleSubmit}>
      <Row className="mb-3">
        <InputField
          label="Nome do Curso"
          type="text"
          placeholder="Nome"
          name="nomecurso"
          value={formData.nomecurso}
          onChange={handleChange}
          icon={<FaBook />}
          colSize={6}
        />
        <InputField
          label="Número de Horas"
          type="number"
          placeholder="Horas"
          name="horas"
          value={formData.horas}
          onChange={handleChange}
          icon={<FaClock />}
          colSize={6}
        />
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>Categoria:</Form.Label>
          <DropdownCheckbox
            label="Selecionar"
            options={['Desenvolvimento', 'Marketing', 'Design']}
            selectedOptions={categoria}
            onChange={(selected) => setCategoria(selected)}
            isMulti={false}
            useCheckboxUI={false}
          />
        </Col>

        <Col md={6}>
          <Form.Label>Área:</Form.Label>
          <DropdownCheckbox
            label="Selecionar"
            options={['Desenvolvimento Movel', 'Desenvolvimento Web', 'Desenvolvimento de Jogos']}
            selectedOptions={area}
            onChange={(selected) => setArea(selected)}
            isMulti={false}
            useCheckboxUI={false}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>Tópico:</Form.Label>
          <DropdownCheckbox
            label="Selecionar"
            options={['Tópico 1', 'Tópico 2', 'Tópico 3']}
            selectedOptions={topico}
            onChange={(selected) => setTopico(selected)}
            isMulti={false}
            useCheckboxUI={false}
          />
        </Col>

        <Col md={6}>
          <Form.Label>Grau de Dificuldade:</Form.Label>
          <DropdownCheckbox
            label="Selecionar"
            options={['Dificuldade 1', 'Dificuldade 2', 'Dificuldade 3', 'Dificuldade 4']}
            selectedOptions={dificuldade}
            onChange={(selected) => setDificuldade(selected)}
            isMulti={false}
            useCheckboxUI={false}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>Certificado:</Form.Label>
          <DropdownCheckbox
            label="Selecionar"
            options={['Sim', 'Não']}
            selectedOptions={certificado}
            onChange={(selected) => setCertificado(selected)}
            isMulti={false}
            useCheckboxUI={false}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <InputField
          label="Descrição"
          type="textarea"
          placeholder="Tudo sobre o curso"
          name="sobreMim"
          value={formData.sobreMim}
          onChange={handleChange}
          colSize={12}
          rows={5}
          style={{ resize: 'none' }}
        />
      </Row>

      
      <div className="d-flex justify-content-center mt-4">
        <Cancelar
          text="Cancelar"
          onClick={handleClose}
          Icon={BsArrowReturnLeft}
          inline={true}
        />
        <Guardar
          text="Enviar"
          onClick={handleSubmit} 
          Icon={LuSend}
        />
      </div>
    </ModalCustom>
  );
};

export default ModalEditarPerfil;