import React, { useState } from 'react';
import axios from '../config/configAxios';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ open, handleClose, onLoginSuccess }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [loginError, setLoginError] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [passError, setPassError] = useState(false);
    const [passErrorMessage, setPassErrorMessage] = useState('');

    const verificarLogin = async (login) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`/colaborador/username/${login}`, {
                headers: { Authorization: `${token}` }
            });
            return response.status === 200;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return false;
            }
            console.error('Erro ao verificar utilizador:', error);
            return true;
        }
    };

    const validateForm = async () => {
        let errors = {};
      
        const loginExists = await verificarLogin(login);
        if (!loginExists) {
          errors.loginError = true;
          errors.loginMessage = "O utilizador que introduziu não se encontra registado.";
        }
      
        if (!password) {
          errors.passError = true;
          errors.passMessage = "Introduza a sua password";
        }
      
        return errors;
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        const errors = await validateForm();
        setLoginError(errors.loginError || false);
        setLoginErrorMessage(errors.loginMessage || "");
        setPassError(errors.passError || false);
        setPassErrorMessage(errors.passMessage || "");
    
        if (Object.keys(errors).length > 0) {
            return;
        }
    
        try {
            const response = await axios.post('/colaborador/login', {
                username: login,
                password: password
            });
            const utilizador = response.data.user;
            console.log("Utilizador:", utilizador);

            sessionStorage.setItem('colaboradorid', utilizador.colaboradorid);
            sessionStorage.setItem('nome', utilizador.nome);

            if (utilizador.ultimologin === null) {
                sessionStorage.setItem('primeirologin', "true");
            } else {
                sessionStorage.setItem('primeirologin', "false");
            }
            
            const tokenResponse = await axios.get(`/colaborador/token/${utilizador.colaboradorid}`);

            sessionStorage.setItem('token', tokenResponse.data.token);
            sessionStorage.setItem('saudacao', tokenResponse.data.saudacao);
    
            // Fechar o modal quando o login for bem-sucedido, antes de navegar
            handleClose();
            
            // Notify parent component of successful login
            if (onLoginSuccess) {
                onLoginSuccess();
            }
            
            navigate('/');
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 401) {
                setPassError(true);
                setPassErrorMessage("Credenciais inválidas.");
            } else {
                console.error('Erro ao fazer login:', error);
            }
        }
    };
    
    const resetForm = () => {
        setLogin('');
        setLoginErrorMessage('');
        setPassword('');
        setPassErrorMessage('');
    };

    const handleCancel = () => {
        resetForm();
        setLoginError(false);
        setPassError(false);
        handleClose();
    };

    return (
        <Modal show={open} onHide={handleCancel} centered>
            <Modal.Header closeButton >
                <h4>
                    <span style={{ color: "#4a4a4a" }}>Soft</span>
                    <span style={{ color: "#00bfff" }}>Skills</span>
                </h4>
            </Modal.Header>
            <Modal.Body>
                <h5 className="text-center">Entrar na tua conta</h5>
                <p className="text-center text-muted">Bem vindo de volta, introduz os teus dados!</p>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Utilizador</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduz o teu utilizador"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            isInvalid={loginError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {loginErrorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Introduz a tua password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={passError}
                            />
                            <InputGroup.Text onClick={handleClickShowPassword} style={{ cursor: "pointer" }}>
                                {showPassword ? <EyeSlashFill /> : <EyeFill />}
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                {passErrorMessage}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" className="w-100 mt-3" onClick={handleLogin}>
                        Entrar
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;