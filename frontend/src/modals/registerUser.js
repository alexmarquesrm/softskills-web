import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendarAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from '../config/configAxios';
import './registerUser.css';

const RegisterUser = ({ show, onClose }) => {
    const [formData, setFormData] = useState({
        primeiro_nome: '',
        ultimo_nome: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefone: '',
        data_nasc: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const p = formData.primeiro_nome.trim();
        const u = formData.ultimo_nome.trim();

        if (p && u) {
            const usernameSugerido = `${p}.${u}`.replace(/\s+/g, '').toLowerCase();
            setFormData(prev => ({
                ...prev,
                username: usernameSugerido
            }));
        }
    }, [formData.primeiro_nome, formData.ultimo_nome]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        setFormData({
            primeiro_nome: '',
            ultimo_nome: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            telefone: '',
            data_nasc: ''
        });
        setError('');
        setSuccess('');
        setValidationErrors({});
        onClose();
    };

    const validateForm = () => {
        const errors = {};
        
        // Check empty fields
        if (!formData.primeiro_nome.trim()) errors.primeiro_nome = "Primeiro nome é obrigatório";
        if (!formData.ultimo_nome.trim()) errors.ultimo_nome = "Último nome é obrigatório";
        if (!formData.username.trim()) errors.username = "Nome de utilizador é obrigatório";
        if (!formData.email.trim()) errors.email = "Email é obrigatório";
        if (!formData.password) errors.password = "Palavra-passe é obrigatória";
        if (!formData.confirmPassword) errors.confirmPassword = "Confirmação da palavra-passe é obrigatória";
        if (!formData.telefone) errors.telefone = "Telemóvel é obrigatório";
        if (!formData.data_nasc) errors.data_nasc = "Data de nascimento é obrigatória";

        // Email format validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email inválido";
        }

        // Password match validation
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "As palavras-passe não coincidem";
        }

        // Phone number validation (9 digits starting with 9)
        if (formData.telefone && !/^9\d{8}$/.test(formData.telefone)) {
            errors.telefone = "Telemóvel deve ter 9 dígitos e começar por 9";
        }

        // Age validation (must be at least 18 years old)
        if (formData.data_nasc) {
            const birthDate = new Date(formData.data_nasc);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                errors.data_nasc = "Deve ter pelo menos 18 anos";
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post('/colaborador/registo', {
                nome: `${formData.primeiro_nome} ${formData.ultimo_nome}`,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                telefone: parseInt(formData.telefone),
                data_nasc: formData.data_nasc,
                sobre_mim: '',
                score: 0
            }, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccess('Registo realizado com sucesso!');
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err) {
            console.error('Erro ao registar:', err);
            setError(err.response?.data?.message || 'Erro ao registar utilizador');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="register-modal" size="xl">
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
                                <h4 className="welcome-title">Criar Nova Conta</h4>
                                <p className="welcome-subtitle">Preencha os dados para se registar</p>
                            </div>

                            {error && <Alert variant="danger" className="register-form-alert register-form-alert-danger">{error}</Alert>}
                            {success && <Alert variant="success" className="register-form-alert register-form-alert-success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="register-form-label">Primeiro Nome</Form.Label>
                                            <div className="register-form-input-group">
                                                <div className="register-form-input-icon">
                                                    <FaUser />
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="primeiro_nome"
                                                    value={formData.primeiro_nome}
                                                    onChange={handleChange}
                                                    placeholder="Primeiro nome"
                                                    isInvalid={!!validationErrors.primeiro_nome}
                                                />
                                            </div>
                                            {validationErrors.primeiro_nome && (
                                                <div className="register-form-error-message">
                                                    {validationErrors.primeiro_nome}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="register-form-label">Último Nome</Form.Label>
                                            <div className="register-form-input-group">
                                                <div className="register-form-input-icon">
                                                    <FaUser />
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="ultimo_nome"
                                                    value={formData.ultimo_nome}
                                                    onChange={handleChange}
                                                    placeholder="Último nome"
                                                    isInvalid={!!validationErrors.ultimo_nome}
                                                />
                                            </div>
                                            {validationErrors.ultimo_nome && (
                                                <div className="register-form-error-message">
                                                    {validationErrors.ultimo_nome}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="register-form-label">Email</Form.Label>
                                    <div className="register-form-input-group">
                                        <div className="register-form-input-icon">
                                            <FaEnvelope />
                                        </div>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            isInvalid={!!validationErrors.email}
                                        />
                                    </div>
                                    {validationErrors.email && (
                                        <div className="register-form-error-message">
                                            {validationErrors.email}
                                        </div>
                                    )}
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="register-form-label">Palavra-passe</Form.Label>
                                            <div className="register-form-input-group">
                                                <div className="register-form-input-icon">
                                                    <FaLock />
                                                </div>
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Palavra-passe"
                                                    isInvalid={!!validationErrors.password}
                                                />
                                                <div className="register-form-password-toggle" onClick={togglePasswordVisibility}>
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </div>
                                            </div>
                                            {validationErrors.password && (
                                                <div className="register-form-error-message">
                                                    {validationErrors.password}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="register-form-label">Confirmar Palavra-passe</Form.Label>
                                            <div className="register-form-input-group">
                                                <div className="register-form-input-icon">
                                                    <FaLock />
                                                </div>
                                                <Form.Control
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="Confirmar palavra-passe"
                                                    isInvalid={!!validationErrors.confirmPassword}
                                                />
                                                <div className="register-form-password-toggle" onClick={toggleConfirmPasswordVisibility}>
                                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                </div>
                                            </div>
                                            {validationErrors.confirmPassword && (
                                                <div className="register-form-error-message">
                                                    {validationErrors.confirmPassword}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="register-form-label">Telemóvel</Form.Label>
                                            <div className="register-form-input-group">
                                                <div className="register-form-input-icon">
                                                    <FaPhone />
                                                </div>
                                                <Form.Control
                                                    type="tel"
                                                    name="telefone"
                                                    value={formData.telefone}
                                                    onChange={handleChange}
                                                    placeholder="Telemóvel"
                                                    isInvalid={!!validationErrors.telefone}
                                                />
                                            </div>
                                            {validationErrors.telefone && (
                                                <div className="register-form-error-message">
                                                    {validationErrors.telefone}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="register-form-label">Data de Nascimento</Form.Label>
                                            <div className="register-form-input-group">
                                                <div className="register-form-input-icon">
                                                    <FaCalendarAlt />
                                                </div>
                                                <Form.Control
                                                    type="date"
                                                    name="data_nasc"
                                                    value={formData.data_nasc}
                                                    onChange={handleChange}
                                                    isInvalid={!!validationErrors.data_nasc}
                                                />
                                            </div>
                                            {validationErrors.data_nasc && (
                                                <div className="register-form-error-message">
                                                    {validationErrors.data_nasc}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button
                                    type="submit"
                                    className="register-form-button w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Carregando...</span>
                                            </div>
                                            A registar...
                                        </div>
                                    ) : (
                                        'Registrar'
                                    )}
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterUser;
