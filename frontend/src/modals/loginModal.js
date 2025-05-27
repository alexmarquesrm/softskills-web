import React, { useState } from 'react';
import axios from '../config/configAxios';
import { Modal, Button, Form, InputGroup, Container, Row, Col, Alert } from 'react-bootstrap';
import { EyeFill, EyeSlashFill, PersonFill, KeyFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, isFirebaseInitialized, initializeFirebase } from '../config/firebase';
import RegisterUser from './registerUser';
import ResetPasswordModal from './resetPasswordModal';
import 'react-toastify/dist/ReactToastify.css';
import './loginModal.css';
import ChangePasswordModal from './changePasswordModal';

const LoginModal = ({ open, handleClose, onLoginSuccess }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [ModalRegisterOpen, setModalRegisterOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [passError, setPassError] = useState(false);
    const [passErrorMessage, setPassErrorMessage] = useState('');
    
    const navigate = useNavigate();

    const validateForm = async () => {
        const errors = {};
        
        if (!login) {
            errors.login = 'Por favor, introduza o seu nome de utilizador';
        }
        
        if (!password) {
            errors.password = 'Por favor, introduza a sua senha';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0 ? {} : errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            const token = response.data.token;
            const saudacao = response.data.saudacao;

            // Armazenar token - principal fonte de autenticação
            sessionStorage.setItem('token', token);
            
            // Armazenar dados para UI (estes não são usados para autorização)
            sessionStorage.setItem('colaboradorid', utilizador.colaboradorid);
            sessionStorage.setItem('nome', utilizador.nome);
            sessionStorage.setItem('email', utilizador.email);
            sessionStorage.setItem('primeirologin', utilizador.ultimologin === null ? "true" : "false");
            
            // Armazenar todos os tipos de usuário
            if (utilizador.allUserTypes && Array.isArray(utilizador.allUserTypes)) {
                sessionStorage.setItem('allUserTypes', utilizador.allUserTypes.join(','));
                // Definir tipo predefinido seguindo a hierarquia: Gestor > Formador > Formando
                let defaultType = utilizador.allUserTypes[0];
                if (utilizador.allUserTypes.includes('Gestor')) {
                    defaultType = 'Gestor';
                } else if (utilizador.allUserTypes.includes('Formador')) {
                    defaultType = 'Formador';
                } else if (utilizador.allUserTypes.includes('Formando')) {
                    defaultType = 'Formando';
                }
                sessionStorage.setItem('tipo', defaultType);
            } else {
                sessionStorage.setItem('allUserTypes', utilizador.tipo);
                sessionStorage.setItem('tipo', utilizador.tipo);
            }
            
            sessionStorage.setItem('saudacao', saudacao);

            // Configurar o token para todas as requisições futuras
            axios.defaults.headers.common['Authorization'] = token;

            // Se o último login for null, mostrar o modal de alteração de password
            if (utilizador.ultimologin === null) {
                resetForm();
                setShowChangePassword(true);
                return;
            }

            // Determinar a rota de redirecionamento baseada nas roles
            let redirectPath = '/';
            const userTypes = utilizador.allUserTypes || [utilizador.tipo];
            const isGestor = userTypes.includes('Gestor');
            const isFormador = userTypes.includes('Formador');
            const isFormando = userTypes.includes('Formando');

            if (isGestor) {
                redirectPath = '/gestor/dashboard';
            } else if (isFormador) {
                redirectPath = '/formador/dashboard';
            } else if (isFormando) {
                redirectPath = '/utilizadores/dashboard';
            }

            // Fechar o modal e redirecionar com a mensagem de boas-vindas
            handleClose();
            navigate(redirectPath, { 
                state: { 
                    welcomeMessage: `${saudacao}, ${utilizador.nome}! Bem-vindo(a) à plataforma de cursos.`
                }
            });
            onLoginSuccess();
        } catch (error) {
            console.error('Erro no login:', error);
            if (error.response?.status === 404) {
                setLoginError(true);
                setLoginErrorMessage("Utilizador não encontrado");
            } else if (error.response?.status === 401) {
                setPassError(true);
                setPassErrorMessage("Password incorreta");
            } else {
                setLoginError(true);
                setLoginErrorMessage("Erro ao fazer login. Tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // Verifica se o Firebase está inicializado
            if (!isFirebaseInitialized()) {
                console.log('Firebase não inicializado, tentando inicializar...');
                try {
                    const initialized = await initializeFirebase();
                    if (!initialized || !isFirebaseInitialized()) {
                        console.error('Falha na inicialização do Firebase');
                        throw new Error('Não foi possível inicializar o Firebase. Por favor, tente novamente mais tarde.');
                    }
                } catch (initError) {
                    console.error('Erro ao inicializar Firebase:', initError);
                    throw new Error('Erro ao inicializar o Firebase. Por favor, tente novamente mais tarde.');
                }
            }

            // Garante que auth e googleProvider estão disponíveis
            if (!auth || !googleProvider) {
                console.error('Auth ou GoogleProvider não disponíveis:', { auth: !!auth, googleProvider: !!googleProvider });
                throw new Error('Firebase Auth não inicializado corretamente. Por favor, tente novamente mais tarde.');
            }

            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            try {
                // Send the Google user data to your backend
                const response = await axios.post('/colaborador/google-login', {
                    googleId: user.uid,
                    email: user.email,
                    name: user.displayName,
                    photoURL: user.photoURL
                });

                if (!response.data || !response.data.user) {
                    throw new Error('Resposta do backend inválida');
                }

                const utilizador = response.data.user;
                const token = response.data.token;
                const saudacao = response.data.saudacao;

                // Armazenar token - principal fonte de autenticação
                sessionStorage.setItem('token', token);
                
                // Armazenar dados para UI (estes não são usados para autorização)
                if (!utilizador.colaboradorid) {
                    throw new Error('ID do colaborador não encontrado na resposta do servidor');
                }
                
                sessionStorage.setItem('colaboradorid', utilizador.colaboradorid);
                sessionStorage.setItem('nome', utilizador.nome);
                sessionStorage.setItem('email', utilizador.email);
                sessionStorage.setItem('primeirologin', utilizador.ultimologin === null ? "true" : "false");
                
                // Armazenar todos os tipos de usuário
                if (utilizador.allUserTypes && Array.isArray(utilizador.allUserTypes)) {
                    sessionStorage.setItem('allUserTypes', utilizador.allUserTypes.join(','));
                    // Definir tipo predefinido seguindo a hierarquia: Gestor > Formador > Formando
                    let defaultType = utilizador.allUserTypes[0];
                    if (utilizador.allUserTypes.includes('Gestor')) {
                        defaultType = 'Gestor';
                    } else if (utilizador.allUserTypes.includes('Formador')) {
                        defaultType = 'Formador';
                    } else if (utilizador.allUserTypes.includes('Formando')) {
                        defaultType = 'Formando';
                    }
                    sessionStorage.setItem('tipo', defaultType);
                } else {
                    sessionStorage.setItem('allUserTypes', utilizador.tipo);
                    sessionStorage.setItem('tipo', utilizador.tipo);
                }
                
                sessionStorage.setItem('saudacao', saudacao);

                // Configurar o token para todas as requisições futuras
                axios.defaults.headers.common['Authorization'] = token;

                // Se o último login for null, mostrar o modal de alteração de password
                if (utilizador.ultimologin === null) {
                    resetForm();
                    setShowChangePassword(true);
                    return;
                }

                // Determinar a rota de redirecionamento baseada nas roles
                let redirectPath = '/';
                const userTypes = utilizador.allUserTypes || [utilizador.tipo];
                const isGestor = userTypes.includes('Gestor');
                const isFormador = userTypes.includes('Formador');
                const isFormando = userTypes.includes('Formando');

                if (isGestor) {
                    redirectPath = '/gestor/dashboard';
                } else if (isFormador) {
                    redirectPath = '/formador/dashboard';
                } else if (isFormando) {
                    redirectPath = '/utilizadores/dashboard';
                }

                // Fechar o modal e redirecionar com a mensagem de boas-vindas
                handleClose();
                navigate(redirectPath, { 
                    state: { 
                        welcomeMessage: `${saudacao}, ${utilizador.nome}! Bem-vindo(a) à plataforma de cursos.`
                    }
                });
                onLoginSuccess();
            } catch (backendError) {
                console.error('Erro na comunicação com o backend:', backendError);
                console.error('Detalhes do erro:', backendError.response?.data);
                throw new Error(backendError.response?.data?.message || 'Erro ao processar login com Google');
            }
        } catch (error) {
            console.error('Erro no login com Google:', error);
            setError(error.message || 'Erro ao fazer login com Google. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setLogin('');
        setPassword('');
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
                    <Alert variant="danger" className="login-form-alert login-form-alert-danger">
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert variant="success" className="login-form-alert login-form-alert-success">
                        {success}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="login-form-label">Nome de Utilizador</Form.Label>
                        <div className={`login-form-input-group ${validationErrors.login ? 'is-invalid' : ''}`}>
                            <div className="login-form-input-icon">
                                <PersonFill />
                            </div>
                            <Form.Control
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="Introduza o seu nome de utilizador"
                            />
                        </div>
                        {validationErrors.login && (
                            <div className="login-form-error-message">{validationErrors.login}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="login-form-label">Senha</Form.Label>
                        <div className={`login-form-input-group ${validationErrors.password ? 'is-invalid' : ''}`}>
                            <div className="login-form-input-icon">
                                <KeyFill />
                            </div>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Introduza a sua senha"
                                className={passError ? 'is-invalid' : ''}
                            />
                            <div 
                                className="login-form-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeSlashFill /> : <EyeFill />}
                            </div>
                        </div>
                        {passError && (
                            <div className="login-form-error-message">{passErrorMessage}</div>
                        )}
                        {validationErrors.password && (
                            <div className="login-form-error-message">{validationErrors.password}</div>
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
                        className="login-form-button w-100 mb-3"
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

                    <div className="text-center mb-3">
                        <div className="divider">
                            <span>ou</span>
                        </div>
                    </div>

                    <Button 
                        variant="outline-primary" 
                        className="google-login-button w-100 mb-3"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <img 
                            src="https://www.google.com/favicon.ico" 
                            alt="Google" 
                            className="google-icon me-2"
                        />
                        Entrar com Google
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