import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from "../config/configAxios";

const ModalEditarQuiz = ({ show, onHide, quizId, onSuccess }) => {
    const [quizData, setQuizData] = useState({
        descricao: '',
        nota: 10, // Nota mínima padrão para passar (50% que é 10 de 20)
        questoes: [{
            pergunta: '',
            opcoes: ['', ''], // Começa com 2 opções
            resposta_correta: 0
        }]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carregar dados do quiz quando o modal abrir
    useEffect(() => {
        if (show && quizId) {
            loadQuizData();
        }
    }, [show, quizId]);

    const loadQuizData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/quizz/${quizId}`);
            if (response.data.success) {
                const quiz = response.data.data;
                
                // Transformar os dados do quiz para o formato esperado pelo formulário
                const questoesFormatadas = quiz.questoes_quizzs.map(questao => {
                    const opcoes = questao.opcoes.map(opcao => opcao.texto);
                    const respostaCorreta = questao.opcoes.findIndex(opcao => opcao.correta);
                    
                    return {
                        pergunta: questao.pergunta,
                        opcoes: opcoes,
                        resposta_correta: respostaCorreta >= 0 ? respostaCorreta : 0
                    };
                });

                setQuizData({
                    descricao: quiz.descricao,
                    nota: quiz.nota || 10,
                    questoes: questoesFormatadas.length > 0 ? questoesFormatadas : [{
                        pergunta: '',
                        opcoes: ['', ''],
                        resposta_correta: 0
                    }]
                });
            }
        } catch (error) {
            console.error('Erro ao carregar quiz:', error);
            setError('Erro ao carregar dados do quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuizData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuestaoChange = (index, field, value) => {
        setQuizData(prev => {
            const newQuestoes = [...prev.questoes];
            if (field === 'opcoes') {
                newQuestoes[index].opcoes = value;
            } else {
                newQuestoes[index][field] = value;
            }
            return { ...prev, questoes: newQuestoes };
        });
    };

    const handleOpcaoChange = (questaoIndex, opcaoIndex, value) => {
        setQuizData(prev => {
            const newQuestoes = [...prev.questoes];
            newQuestoes[questaoIndex].opcoes[opcaoIndex] = value;
            return { ...prev, questoes: newQuestoes };
        });
    };

    const addQuestao = () => {
        setQuizData(prev => ({
            ...prev,
            questoes: [...prev.questoes, {
                pergunta: '',
                opcoes: ['', ''],
                resposta_correta: 0
            }]
        }));
    };

    const removeQuestao = (index) => {
        setQuizData(prev => ({
            ...prev,
            questoes: prev.questoes.filter((_, i) => i !== index)
        }));
    };

    const addOpcao = (questaoIndex) => {
        setQuizData(prev => {
            const newQuestoes = [...prev.questoes];
            newQuestoes[questaoIndex].opcoes.push('');
            return { ...prev, questoes: newQuestoes };
        });
    };

    const removeOpcao = (questaoIndex, opcaoIndex) => {
        setQuizData(prev => {
            const newQuestoes = [...prev.questoes];
            if (newQuestoes[questaoIndex].opcoes.length > 2) {
                newQuestoes[questaoIndex].opcoes.splice(opcaoIndex, 1);
                // Ajusta resposta_correta se necessário
                if (newQuestoes[questaoIndex].resposta_correta >= newQuestoes[questaoIndex].opcoes.length) {
                    newQuestoes[questaoIndex].resposta_correta = 0;
                }
            }
            return { ...prev, questoes: newQuestoes };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação extra no frontend
        for (const questao of quizData.questoes) {
            if (!questao.pergunta || questao.pergunta.trim() === '') {
                alert('Todas as questões devem ter uma pergunta.');
                return;
            }
            if (!Array.isArray(questao.opcoes) || questao.opcoes.length < 2) {
                alert('Cada questão deve ter pelo menos 2 opções.');
                return;
            }
            if (questao.opcoes.some(opcao => !opcao || opcao.trim() === '')) {
                alert('Todas as opções devem ser preenchidas.');
                return;
            }
            if (typeof questao.resposta_correta !== 'number' || questao.resposta_correta < 0 || questao.resposta_correta >= questao.opcoes.length) {
                alert('Selecione uma resposta correta válida para cada questão.');
                return;
            }
        }

        try {
            setLoading(true);
            await axios.put(`/quizz/${quizId}`, quizData);
            onSuccess();
            onHide();
        } catch (error) {
            console.error('Erro ao atualizar quiz:', error);
            alert(error.response?.data?.message || 'Erro ao atualizar quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Editar Quiz</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">A carregar...</span>
                        </Spinner>
                        <p className="mt-2">A carregar dados do quiz...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="descricao"
                                        value={quizData.descricao}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Nota Mínima (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="nota"
                                        value={quizData.nota}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5>Questões</h5>
                        {quizData.questoes.map((questao, index) => (
                            <div key={index} className="mb-4 p-3 border rounded">
                                <Row className="mb-2">
                                    <Col>
                                        <h6>Questão {index + 1}</h6>
                                    </Col>
                                    <Col xs="auto">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeQuestao(index)}
                                            disabled={quizData.questoes.length === 1}
                                        >
                                            Remover Questão
                                        </Button>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Pergunta</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={questao.pergunta}
                                        onChange={(e) => handleQuestaoChange(index, 'pergunta', e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Opções</Form.Label>
                                    {questao.opcoes.map((opcao, opcaoIndex) => (
                                        <div key={opcaoIndex} className="mb-2 d-flex align-items-center gap-2">
                                            <Form.Check
                                                type="radio"
                                                id={`questao-${index}-opcao-${opcaoIndex}`}
                                                name={`questao-${index}`}
                                                checked={questao.resposta_correta === opcaoIndex}
                                                onChange={() => handleQuestaoChange(index, 'resposta_correta', opcaoIndex)}
                                            />
                                            <Form.Control
                                                type="text"
                                                value={opcao}
                                                onChange={(e) => handleOpcaoChange(index, opcaoIndex, e.target.value)}
                                                placeholder={`Opção ${opcaoIndex + 1}`}
                                                required
                                            />
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeOpcao(index, opcaoIndex)}
                                                disabled={questao.opcoes.length <= 2}
                                            >
                                                -
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => addOpcao(index)}
                                        className="mt-2"
                                    >
                                        Adicionar Opção
                                    </Button>
                                </Form.Group>
                            </div>
                        ))}

                        <Button
                            variant="secondary"
                            onClick={addQuestao}
                            className="mb-3"
                        >
                            Adicionar Questão
                        </Button>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'A atualizar...' : 'Atualizar Quiz'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ModalEditarQuiz; 