import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { KeyFill, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import axios from '../config/configAxios';
import './changePasswordModal.css';

const ChangePasswordModal = ({ show, onHide }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        
        if (!formData.currentPassword) {
            errors.currentPassword = 'Por favor, introduza a sua senha atual';
        }
        
        if (!formData.newPassword) {
            errors.newPassword = 'Por favor, introduza a nova senha';
        } else if (formData.newPassword.length < 8) {
            errors.newPassword = 'A senha deve ter pelo menos 8 caracteres';
        }
        
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Por favor, confirme a nova senha';
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = 'As senhas não coincidem';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await axios.post('/colaborador/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            
            if (response.status === 200) {
                setSuccess('Senha alterada com sucesso!');
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                setError(response.data.message || 'Erro ao alterar a senha');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setError('');
        setSuccess('');
        setLoading(false);
        setShowPasswords({
            current: false,
            new: false,
            confirm: false
        });
        setValidationErrors({});
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="change-password-modal">
            <Modal.Header>
                <div className="logo-container">
                    <h2 className="app-logo">
                        <span className="logo-first">Soft</span>
                        <span className="logo-second">Skills</span>
                    </h2>
                    <h4 className="welcome-title">Alterar Senha</h4>
                    <p className="welcome-subtitle">Introduza a sua senha atual e a nova senha</p>
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
                        <Form.Label className="register-form-label">Senha Atual</Form.Label>
                        <div className={`register-form-input-group ${validationErrors.currentPassword ? 'is-invalid' : ''}`}>
                            <div className="register-form-input-icon">
                                <KeyFill />
                            </div>
                            <Form.Control
                                type={showPasswords.current ? "text" : "password"}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                placeholder="Introduza a sua senha atual"
                            />
                            <div 
                                className="register-form-password-toggle"
                                onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                            >
                                {showPasswords.current ? <EyeSlashFill /> : <EyeFill />}
                            </div>
                        </div>
                        {validationErrors.currentPassword && (
                            <div className="register-form-error-message">{validationErrors.currentPassword}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="register-form-label">Nova Senha</Form.Label>
                        <div className={`register-form-input-group ${validationErrors.newPassword ? 'is-invalid' : ''}`}>
                            <div className="register-form-input-icon">
                                <KeyFill />
                            </div>
                            <Form.Control
                                type={showPasswords.new ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                placeholder="Introduza a nova senha"
                            />
                            <div 
                                className="register-form-password-toggle"
                                onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                            >
                                {showPasswords.new ? <EyeSlashFill /> : <EyeFill />}
                            </div>
                        </div>
                        {validationErrors.newPassword && (
                            <div className="register-form-error-message">{validationErrors.newPassword}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="register-form-label">Confirmar Nova Senha</Form.Label>
                        <div className={`register-form-input-group ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}>
                            <div className="register-form-input-icon">
                                <KeyFill />
                            </div>
                            <Form.Control
                                type={showPasswords.confirm ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                placeholder="Confirme a nova senha"
                            />
                            <div 
                                className="register-form-password-toggle"
                                onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                            >
                                {showPasswords.confirm ? <EyeSlashFill /> : <EyeFill />}
                            </div>
                        </div>
                        {validationErrors.confirmPassword && (
                            <div className="register-form-error-message">{validationErrors.confirmPassword}</div>
                        )}
                    </Form.Group>

                    <Button 
                        type="submit" 
                        className="register-form-button w-100"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                A processar...
                            </>
                        ) : (
                            'Alterar Senha'
                        )}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePasswordModal; 