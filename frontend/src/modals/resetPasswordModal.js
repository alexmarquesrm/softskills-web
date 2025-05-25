import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { EnvelopeFill } from 'react-bootstrap-icons';
import axios from '../config/configAxios';
import './loginModal.css';

const ResetPasswordModal = ({ show, onHide }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!email) {
            errors.email = 'Por favor, introduza o seu email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Por favor, introduza um email válido';
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
        setSuccess('');

        try {
            const response = await axios.post('/colaborador/reset-password', {
                email: email
            });

            setSuccess('Se o email estiver registado, receberá uma nova password em breve.');
            // Remover o setTimeout que estava causando o problema
            // O usuário pode fechar manualmente a modal após ler a mensagem
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao redefinir a password');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setError('');
        setSuccess('');
        setValidationErrors({});
        setIsLoading(false);
        onHide();
    };

    // Função separada para limpar apenas os dados do formulário
    const clearFormData = () => {
        setEmail('');
        setError('');
        setSuccess('');
        setValidationErrors({});
        setIsLoading(false);
    };

    // Limpar dados quando a modal for aberta
    React.useEffect(() => {
        if (show) {
            clearFormData();
        }
    }, [show]);

    return (
        <Modal show={show} onHide={resetForm} centered className="login-modal reset-password-modal">
            <Modal.Header closeButton>
                <div className="logo-container">
                    <h2 className="app-logo">
                        <span className="logo-first">Soft</span>
                        <span className="logo-second">Skills</span>
                    </h2>
                    <h4 className="welcome-title">Redefinir Password</h4>
                    <p className="welcome-subtitle">Introduza o seu email para receber uma nova password</p>
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
                        <Form.Label className="register-form-label">Email</Form.Label>
                        <div className={`register-form-input-group ${validationErrors.email ? 'is-invalid' : ''}`}>
                            <div className="register-form-input-icon">
                                <EnvelopeFill />
                            </div>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Introduza o seu email"
                                disabled={success} // Desabilitar após sucesso
                            />
                        </div>
                        {validationErrors.email && (
                            <div className="register-form-error-message">{validationErrors.email}</div>
                        )}
                    </Form.Group>

                    {!success && ( // Só mostrar o botão se ainda não foi enviado com sucesso
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
                                'Enviar'
                            )}
                        </Button>
                    )}
                    
                    {success && (
                        <Button 
                            variant="secondary"
                            className="w-100"
                            onClick={resetForm}
                        >
                            Fechar
                        </Button>
                    )}
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ResetPasswordModal;