import React, { useState } from 'react';
import axios from '../config/configAxios';
import { Modal, Button, Form, InputGroup, Container, Row, Col, Alert } from 'react-bootstrap';
import { EyeFill, EyeSlashFill, PersonFill, KeyFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import RegisterUser from './registerUser';
import ResetPasswordModal from './resetPasswordModal';
import 'react-toastify/dist/ReactToastify.css';
import './loginModal.css';
import ChangePasswordModal from './changePasswordModal';

const LoginModal = ({ open, handleClose, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [ModalRegisterOpen, setModalRegisterOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        
        if (!formData.login) {
            errors.login = 'Por favor, introduza o seu nome de utilizador';
        }
        
        if (!formData.password) {
            errors.password = 'Por favor, introduza a sua senha';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('/colaborador/login', {
                username: formData.login,
                password: formData.password
            });

            const utilizador = response.data.user;
            const token = response.data.token;
            const saudacao = response.data.saudacao;

            // Armazenar token - principal fonte de autenticação
            sessionStorage.setItem('token', token);
            
            // Determinar o tipo atual do usuário
            const userType = utilizador.tipo;
            const allUserTypes = utilizador.allUserTypes || [userType];
            const isGestor = userType === 'Gestor' || allUserTypes.includes('Gestor');
            
            // Se for gestor, definir o tipo atual como Gestor
            const currentType = isGestor ? 'Gestor' : userType;
            
            // Armazenar dados para UI (estes não são usados para autorização)
            sessionStorage.setItem('colaboradorid', utilizador.colaboradorid);
            sessionStorage.setItem('nome', utilizador.nome);
            sessionStorage.setItem('email', utilizador.email);
            sessionStorage.setItem('primeirologin', utilizador.isFirstLogin ? "true" : "false");
            sessionStorage.setItem('tipo', currentType);
            sessionStorage.setItem('saudacao', saudacao);

            // Se o último login for null, mostrar o modal de alteração de password
            if (utilizador.ultimologin === null) {
                resetForm();
                setShowChangePassword(true);
            } else {
                // Determinar a rota de redirecionamento baseada nas roles
                let redirectPath = '/';
                const userType = utilizador.tipo;
                const allUserTypes = utilizador.allUserTypes || [userType];
                const isGestor = userType === 'Gestor' || allUserTypes.includes('Gestor');

                if (isGestor) {
                    redirectPath = '/gestor/dashboard';
                } else if (userType === 'Formando' || allUserTypes.includes('Formando')) {
                    redirectPath = '/utilizadores/dashboard';
                } else if (userType === 'Formador' || allUserTypes.includes('Formador')) {
                    redirectPath = '/formador/dashboard';
                }

                // Fechar o modal e redirecionar com a mensagem de boas-vindas
                handleClose();
                navigate(redirectPath, { 
                    state: { 
                        welcomeMessage: `${saudacao}, ${utilizador.nome}! Bem-vindo(a) à plataforma de cursos.`
                    }
                });
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer login');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            login: '',
            password: ''
        });
        setError('');
        setValidationErrors({});
        setShowPassword(false);
        setIsLoading(false);
    };

    const closeModal = () => {
        resetForm();
        handleClose();
    };

    return (
        <Modal show={open} onHide={closeModal} centered className="login-modal">
            <Modal.Header>
                <div className="logo-container">
                    <h2 className="app-logo">
                        <span className="logo-first">Soft</span>
                        <span className="logo-second">Skills</span>
                    </h2>
                    <h4 className="welcome-title">Bem-vindo</h4>
                    <p className="welcome-subtitle">Introduza as suas credenciais para aceder</p>
                </div>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" className="register-form-alert register-form-alert-danger">
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert variant="success" className="register-form-alert register-form-alert-success">
                        {success}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="register-form-label">Nome de Utilizador</Form.Label>
                        <div className={`register-form-input-group ${validationErrors.login ? 'is-invalid' : ''}`}>
                            <div className="register-form-input-icon">
                                <PersonFill />
                            </div>
                            <Form.Control
                                type="text"
                                value={formData.login}
                                onChange={(e) => setFormData({...formData, login: e.target.value})}
                                placeholder="Introduza o seu nome de utilizador"
                            />
                        </div>
                        {validationErrors.login && (
                            <div className="register-form-error-message">{validationErrors.login}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="register-form-label">Senha</Form.Label>
                        <div className={`register-form-input-group ${validationErrors.password ? 'is-invalid' : ''}`}>
                            <div className="register-form-input-icon">
                                <KeyFill />
                            </div>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Introduza a sua senha"
                            />
                            <div 
                                className="register-form-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeSlashFill /> : <EyeFill />}
                            </div>
                        </div>
                        {validationErrors.password && (
                            <div className="register-form-error-message">{validationErrors.password}</div>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-end mb-3">
                        <Button 
                            variant="link" 
                            className="forgot-password-link"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowResetPassword(true);
                            }}
                            disabled={isLoading}
                        >
                            Esqueceu a password?
                        </Button>
                    </div>

                    <Button 
                        type="submit" 
                        className="register-form-button w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                A processar...
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </Button>

                    <div className="text-center mt-3">
                        <Button 
                            variant="link" 
                            className="register-link"
                            onClick={() => setModalRegisterOpen(true)}
                        >
                            Não tem conta? Registar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <RegisterUser show={ModalRegisterOpen} onClose={() => setModalRegisterOpen(false)} />
            <ChangePasswordModal 
                show={showChangePassword}
                onHide={() => {
                    setShowChangePassword(false);
                    handleClose();
                }}
            />
            <ResetPasswordModal
                show={showResetPassword}
                onHide={() => setShowResetPassword(false)}
            />
        </Modal>
    );
};

export default LoginModal;