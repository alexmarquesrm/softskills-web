import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from '../config/configAxios';
import { KeyFill, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import './changePasswordModal.css';

const ChangePasswordModal = ({ show, onHide, onSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validações
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As passwords não coincidem');
            return;
        }

        if (newPassword.length < 8) {
            setError('A nova password deve ter pelo menos 8 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('/colaborador/change-password', {
                currentPassword,
                newPassword
            });

            setSuccess('Password alterada com sucesso!');
            
            // Limpar o flag de primeiro login
            sessionStorage.setItem('primeirologin', 'false');

            // Limpar o formulário
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Chamar o callback de sucesso após 2 segundos
            setTimeout(() => {
                onSuccess();
                onHide();
            }, 2000);

        } catch (error) {
            if (error.response?.status === 401) {
                setError('Password atual incorreta');
            } else {
                setError('Erro ao alterar password. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Se for primeiro login, redirecionar para a página inicial
        const isFirstLogin = sessionStorage.getItem('primeirologin') === 'true';
        if (isFirstLogin) {
            // Limpar dados da sessão
            sessionStorage.clear();
            // Redirecionar para a página inicial
            window.location.href = '/';
            return;
        }

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        onHide();
    };

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            centered 
            className="change-password-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Alterar Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {sessionStorage.getItem('primeirologin') === 'true' && (
                    <Alert variant="info" className="mb-4">
                        Por motivos de segurança, é necessário alterar a sua password para continuar.
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Password Atual</Form.Label>
                        <div className="password-input-group">
                            <KeyFill className="input-icon" />
                            <Form.Control
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Introduza a password atual"
                            />
                            <div 
                                className="password-toggle"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeSlashFill /> : <EyeFill />}
                            </div>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nova Password</Form.Label>
                        <div className="password-input-group">
                            <KeyFill className="input-icon" />
                            <Form.Control
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Introduza a nova password"
                            />
                            <div 
                                className="password-toggle"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeSlashFill /> : <EyeFill />}
                            </div>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Confirmar Nova Password</Form.Label>
                        <div className="password-input-group">
                            <KeyFill className="input-icon" />
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme a nova password"
                            />
                            <div 
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                            </div>
                        </div>
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 change-password-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'A processar...' : 'Alterar Password'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePasswordModal; 