import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import InputField from '../components/textFields/basic';
import DropdownCheckbox from '../components/dropdown/dropdown';
import ModalCustom from './modalCustom';
import Cancelar from '../components/buttons/cancelButton';
import Guardar from '../components/buttons/saveButton';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { LuSend } from 'react-icons/lu';
import { IoCalendarNumberSharp } from "react-icons/io5";
import { useDropzone } from 'react-dropzone';
import { FaRegSave } from "react-icons/fa";

const ModalEditarFicheiro = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({});
  const [titulo, settitulo] = useState([]);
  const [dataentrega, setdataentrega] = useState([]);
  const [sobreficheiro, setsobreficheiro] = useState([]);


  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.jpg,.jpeg,.png,.pdf,.docx',
    maxFiles: 5,
  });

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
    <ModalCustom show={show} handleClose={handleClose} title="Editar Ficheiro" onSubmit={handleSubmit}>
      <Row className="justify-content-start mb-4">
        <Col md={12}>
          <div className="border p-4 shadow-sm rounded" style={{ backgroundColor: "#fff" }}>

            <Row className="mb-3">
            <InputField label="Título" type="text" placeholder="video1" name="titulo" value={formData.titulo} onChange={handleChange} colSize={6}/>
            <InputField label="Data Entrega" type="date" placeholder="" name="dataNasc" value={formData.dataentrega} onChange={handleChange} icon={<IoCalendarNumberSharp />} colSize={6} />
            </Row>
          



          <Row className="mb-3">
            <InputField label="Descrição"
              type="textarea"
              placeholder="Aula teorica falada um pouco de como se faz e nao faz nada, é sempre importnate realizar o estudo desta componente" 
              name="descricao" value={formData.sobreficheiro} onChange={handleChange} colSize={12} rows={5} style={{ resize: 'none' }} />
          </Row>


          <Row className="mb-3">
            <Col md={12}>
              <Form.Label>Upload de Arquivos</Form.Label>
              <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #39639C', padding: '20px', textAlign: 'center' }}>
                <input {...getInputProps()} />
                <p>Arraste e solte o arquivo aqui ou clique para selecionar</p>
                <p>Arquivos permitidos: .jpg, .jpeg, .png, .pdf, .docx</p>
              </div>
            </Col>

          </Row>

          <div className="d-flex justify-content-center mt-4">
            <Cancelar text="Cancelar" onClick={handleClose} Icon={BsArrowReturnLeft} inline={true}/>
            <Guardar text={"Guardar"} onClick={handleSubmit} Icon={FaRegSave} />

          </div>
        </div>
      </Col>
    </Row>
    </ModalCustom >
  );
};

export default ModalEditarFicheiro;
