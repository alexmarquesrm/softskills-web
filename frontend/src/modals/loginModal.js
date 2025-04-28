import React, { useState } from 'react';
import axios from '../config/configAxios';
import { Modal, Button, Form, InputGroup, Container, Row, Col } from 'react-bootstrap';
import { EyeFill, EyeSlashFill, PersonFill, KeyFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import './loginModal.css';

const LoginModal = ({ open, handleClose, onLoginSuccess }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [passError, setPassError] = useState(false);
    const [passErrorMessage, setPassErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const verificarLogin = async (login) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`/colaborador/username/${login}`, {
                headers: { Authorization: `${token}` }
            });
            return response.status === 200;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            console.error('Erro ao verificar utilizador:', error);
            return true;
        }
    };

    const validateForm = async () => {
        let errors = {};

        if (!login.trim()) {
            errors.loginError = true;
            errors.loginMessage = "Por favor, introduza o seu nome de utilizador";
        } else {
            const loginExists = await verificarLogin(login);
            if (!loginExists) {
                errors.loginError = true;
                errors.loginMessage = "O utilizador que introduziu não se encontra registado.";
            }
        }

        if (!password) {
            errors.passError = true;
            errors.passMessage = "Por favor, introduza a sua password";
        }

        return errors;
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        setIsLoading(true);
        const errors = await validateForm();
        setLoginError(errors.loginError || false);
        setLoginErrorMessage(errors.loginMessage || "");
        setPassError(errors.passError || false);
        setPassErrorMessage(errors.passMessage || "");

        if (Object.keys(errors).length > 0) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/colaborador/login', {
                username: login,
                password: password
            });

            const utilizador = response.data.user;

            // Store basic user information
            sessionStorage.setItem('colaboradorid', utilizador.colaboradorid);
            sessionStorage.setItem('nome', utilizador.nome);
            sessionStorage.setItem('email', utilizador.email);
            sessionStorage.setItem('primeirologin', utilizador.ultimologin === null ? "true" : "false");
            
            // Store the default active type
            sessionStorage.setItem('tipo', utilizador.tipo);
            
            // Store all user types if available
            if (utilizador.allUserTypes && utilizador.allUserTypes.length > 0) {
                sessionStorage.setItem('allUserTypes', utilizador.allUserTypes.join(','));
            } else {
                // Fallback to single type if allUserTypes is not available
                sessionStorage.setItem('allUserTypes', utilizador.tipo);
            }

            const tokenResponse = await axios.get(`/colaborador/token/${utilizador.colaboradorid}`);

            sessionStorage.setItem('token', tokenResponse.data.token);
            sessionStorage.setItem('saudacao', tokenResponse.data.saudacao);

            handleClose();
            if (onLoginSuccess) onLoginSuccess();
            navigate('/');
        } catch (error) {
            if (error.response?.status === 404 || error.response?.status === 401) {
                setPassError(true);
                setPassErrorMessage("Credenciais inválidas. Por favor, verifique os seus dados.");
            } else {
                console.error('Erro ao fazer login:', error);
            }
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setLogin('');
        setPassword('');
        setLoginErrorMessage('');
        setPassErrorMessage('');
    };

    const handleCancel = () => {
        resetForm();
        setLoginError(false);
        setPassError(false);
        handleClose();
    };

    const handleRegister = () => {
        handleClose();
        navigate('/register');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Modal show={open} onHide={handleCancel} centered className="login-modal">
            <Modal.Header closeButton className="border-0 pb-0 position-relative">
                <div className="logo-container w-100 text-center">
                    <h2 className="app-logo mb-0">
                        <span className="logo-first">Soft</span>
                        <span className="logo-second">Skills</span>
                    </h2>
                </div>
            </Modal.Header>
            <Modal.Body className="pt-0">
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} md={10}>
                            <div className="text-center mb-4">
                                <h4 className="welcome-title">Bem-vindo de volta!</h4>
                                <p className="welcome-subtitle">Introduza os seus dados para continuar</p>
                            </div>

                            <Form>
                                <Form.Group className="mb-4">
                                    <InputGroup className="input-group-custom">
                                        <InputGroup.Text>
                                            <PersonFill />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome de utilizador"
                                            value={login}
                                            onChange={(e) => setLogin(e.target.value)}
                                            isInvalid={loginError}
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                        />
                                    </InputGroup>
                                    {loginError && (
                                        <div className="error-message">
                                            <small>{loginErrorMessage}</small>
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <InputGroup className="input-group-custom">
                                        <InputGroup.Text>
                                            <KeyFill />
                                        </InputGroup.Text>
                                        <Form.Control type={showPassword ? "text" : "password"} placeholder="Password"
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            isInvalid={passError} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                                        <InputGroup.Text onClick={handleClickShowPassword} className="password-toggle">
                                            {showPassword ? <EyeSlashFill /> : <EyeFill />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                    {passError && (
                                        <div className="error-message">
                                            <small>{passErrorMessage}</small>
                                        </div>
                                    )}
                                </Form.Group>

                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="link" className="forgot-password p-0">
                                        Esqueceu a password?
                                    </Button>
                                </div>

                                <Button
                                    variant="primary"
                                    className="login-button w-100"
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'A processar...' : 'Entrar'}
                                </Button>

                                <div className="text-center mt-4 mb-2">
                                    <p className="register-prompt mb-0">
                                        Não tem uma conta?{' '}
                                        <Button
                                            variant="link"
                                            className="register-link p-0"
                                            onClick={handleRegister}
                                        >
                                            Registar
                                        </Button>
                                    </p>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;