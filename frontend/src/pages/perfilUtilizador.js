import React, { useState } from 'react';
import { Form, Container, Row, Col, InputGroup } from 'react-bootstrap';
import profilePic from '../logo.svg'; 
import Guardar from '../components/buttons/guardarbutton';

import { FaRegSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md"; // Ícone de e-mail
import { FaMobileAlt } from "react-icons/fa"; // Ícone de telemovel
import { FaEye, FaEyeSlash } from "react-icons/fa6"; // Ícones para mostrar/ocultar senha

const PerfilUtilizador = () => {
  const [formData, setFormData] = useState({
    primeiroNome: '',
    ultimoNome: '',
    nomeUtilizador: '',
    email: '',
    numeroTelemovel: '',
    sobreMim: '',
    novaPassword: '',
    confirmarPassword: '',
    receberEmails: false,
    notificacoesForum: false
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar a senha

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState); 
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-start">
        
        <Col md={12} className="mb-4">
          <h2 className="form-title">Perfil Utilizador</h2>
        </Col>
      </Row>

      <Row className="justify-content-start">
        
        <Col md={3} className="text-center mb-4">
          <div className="perfil-container d-flex flex-column align-items-center">
            <img
              src={profilePic}
              alt="Foto de Perfil"
              className="rounded-circle perfil-img shadow-lg"
              width="150"
              height="150"
            />
            <h5 className="mt-3 perfil-nome">Joana Marques</h5>
          </div>
        </Col>

        
        <Col md={9} className="d-flex align-items-center mb-4">
          <div className="w-100">
            <Row>
              <Col md={6}>
                <Form.Group controlId="formPrimeiroNome">
                  <Form.Label>Primeiro Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Joana"
                    name="primeiroNome"
                    value={formData.primeiroNome}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formUltimoNome">
                  <Form.Label>Último Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Marques"
                    name="ultimoNome"
                    value={formData.ultimoNome}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Form.Group>
              </Col>
            </Row>

          
            <Form.Group controlId="formNomeUtilizador">
              <Form.Label>Nome Utilizador</Form.Label>
              <Form.Control
                type="text"
                placeholder="Joana Marques"
                name="nomeUtilizador"
                value={formData.nomeUtilizador}
                onChange={handleChange}
                className="form-input"
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <MdEmail />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="email@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </InputGroup>
            </Form.Group>

           
            <Form.Group controlId="formNumeroTelemovel">
              <Form.Label>Número Telemóvel</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaMobileAlt />
                </InputGroup.Text>
                <Form.Control
                  type="tel"
                  placeholder="123456789"
                  name="numeroTelemovel"
                  value={formData.numeroTelemovel}
                  onChange={handleChange}
                  className="form-input"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formSobreMim">
              <Form.Label>Sobre Mim</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Fale um pouco sobre você"
                name="sobreMim"
                value={formData.sobreMim}
                onChange={handleChange}
                className="form-input"
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formNovaPassword">
                  <Form.Label>Nova Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      name="novaPassword"
                      value={formData.novaPassword}
                      onChange={handleChange}
                      className="form-input"
                    />
                    <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formConfirmarPassword">
                  <Form.Label>Confirmar Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      name="confirmarPassword"
                      value={formData.confirmarPassword}
                      onChange={handleChange}
                      className="form-input"
                    />
                    <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Check
                type="switch"
                id="receberEmails"
                label="Receber e-mails promocionais"
                name="receberEmails"
                checked={formData.receberEmails}
                onChange={handleChange}
                className="form-switch"
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="switch"
                id="notificacoesForum"
                label="Notificações do Fórum"
                name="notificacoesForum"
                checked={formData.notificacoesForum}
                onChange={handleChange}
                className="form-switch"
              />
            </Form.Group>

            <div className="text-center mt-4">
              <Guardar text={'Guardar'} onClick={() => alert("Botão clicado")} Icon={FaRegSave} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PerfilUtilizador;
