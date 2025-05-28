import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Spinner, Alert, Form, Card, Badge, ProgressBar, Row, Col } from "react-bootstrap";
import { BsClock, BsQuestionCircle, BsCheckCircle, BsXCircle } from "react-icons/bs";
import axios from "../../config/configAxios";
import { toast } from 'react-toastify';

export default function QuizModal({ show, onHide, quizId, onQuizCompleted }) {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [quizIniciado, setQuizIniciado] = useState(false);
  const [quizConcluido, setQuizConcluido] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [jaRespondido, setJaRespondido] = useState(false);
  const [resultadoAnterior, setResultadoAnterior] = useState(null);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (show && quizId) {
      setLoading(true);
      setError(null);
      setQuiz(null);
      setRespostas({});
      setQuestaoAtual(0);
      setQuizIniciado(false);
      setQuizConcluido(false);
      setSubmitting(false);
      setResultado(null);
      setJaRespondido(false);
      setResultadoAnterior(null);
      
      // Load quiz data and check completion
      Promise.all([
        axios.get(`/quizz/${quizId}`),
        axios.get(`/quizz/${quizId}/completion`)
      ])
        .then(([quizRes, completionRes]) => {
          if (quizRes.data && quizRes.data.success) {
            setQuiz(quizRes.data.data);
            setTempoRestante((quizRes.data.data.limite_tempo || 30) * 60); // Convert minutes to seconds
          } else {
            setError("Erro ao carregar quiz");
            return;
          }

          if (completionRes.data && completionRes.data.success) {
            if (completionRes.data.completed) {
              setJaRespondido(true);
              setQuizConcluido(true);
              setResultadoAnterior({
                nota: completionRes.data.data.nota,
                pontuacao: completionRes.data.data.respostas?.length || 0,
                totalQuestoes: quizRes.data.data.questoes_quizzs?.length || 0
              });
            }
          }
        })
        .catch(err => {
          setError("Erro ao carregar quiz");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [show, quizId]);

  const iniciarQuiz = () => {
    setQuizIniciado(true);
  };

  const handleRespostaChange = (questaoId, opcaoId) => {
    setRespostas(prev => ({
      ...prev,
      [questaoId]: opcaoId
    }));
  };

  const proximaQuestao = () => {
    if (questaoAtual < quiz.questoes_quizzs.length - 1) {
      setQuestaoAtual(prev => prev + 1);
    }
  };

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = useCallback(async (autoSubmit = false) => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      const respostasArray = Object.entries(respostas).map(([questaoId, opcaoId]) => ({
        questao_id: parseInt(questaoId),
        opcao_id: parseInt(opcaoId)
      }));

      const response = await axios.post(`/quizz/${quizId}/respostas`, {
        respostas: respostasArray
      });

      if (response.data.success) {
        setResultado(response.data.data);
        setQuizConcluido(true);
        
        if (!autoSubmit) {
          toast.success("Quiz submetido com sucesso!");
        } else {
          toast.warning("Tempo esgotado! Quiz submetido automaticamente.");
        }

        // Chamar callback para refresh da página após um delay
        if (onQuizCompleted) {
          setTimeout(() => {
            onQuizCompleted();
          }, 2000); // Delay para permitir que o usuário veja o resultado
        }
      }
    } catch (error) {
      console.error('Erro ao submeter quiz:', error);
      toast.error('Erro ao submeter quiz. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }, [quizId, respostas, submitting]);

  // Timer effect - moved after handleSubmitQuiz definition
  useEffect(() => {
    let interval = null;
    if (quizIniciado && !quizConcluido && tempoRestante > 0) {
      interval = setInterval(() => {
        setTempoRestante(tempo => {
          if (tempo <= 1) {
            handleSubmitQuiz(true); // Auto-submit when time runs out
            return 0;
          }
          return tempo - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizIniciado, quizConcluido, handleSubmitQuiz]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    // Se o quiz foi concluído com sucesso, chamar callback para refresh
    if ((resultado || jaRespondido) && onQuizCompleted) {
      onQuizCompleted();
    }
    
    setQuizIniciado(false);
    setQuizConcluido(false);
    setRespostas({});
    setQuestaoAtual(0);
    setResultado(null);
    onHide();
  };

  const getProgressPercentage = () => {
    if (!quiz || !quiz.questoes_quizzs) return 0;
    return ((questaoAtual + 1) / quiz.questoes_quizzs.length) * 100;
  };

  const getRespostasCount = () => {
    return Object.keys(respostas).length;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton={!quizIniciado || quizConcluido}>
        <Modal.Title className="d-flex align-items-center">
          <BsQuestionCircle className="me-2 text-primary" />
          {quiz?.descricao || "Quiz"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">A carregar quiz...</p>
          </div>
        ) : error ? (
          <div className="p-4">
            <Alert variant="danger" className="d-flex align-items-center">
              <BsXCircle className="me-2" />
              {error}
            </Alert>
          </div>
        ) : quiz ? (
          <>
            {/* Quiz Header with Timer and Progress */}
            {quizIniciado && !quizConcluido && (
              <div className="bg-light border-bottom p-3">
                <Row className="align-items-center">
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <BsClock className="me-2 text-warning" />
                      <span className={`fw-bold ${tempoRestante <= 300 ? 'text-danger' : 'text-dark'}`}>
                        {formatTime(tempoRestante)}
                      </span>
                    </div>
                  </Col>
                  <Col md={4} className="text-center">
                    <small className="text-muted">
                      Questão {questaoAtual + 1} de {quiz.questoes_quizzs?.length || 0}
                    </small>
                  </Col>
                  <Col md={4} className="text-end">
                    <small className="text-muted">
                      Respondidas: {getRespostasCount()}/{quiz.questoes_quizzs?.length || 0}
                    </small>
                  </Col>
                </Row>
                <ProgressBar 
                  now={getProgressPercentage()} 
                  className="mt-2" 
                  style={{ height: '4px' }}
                  variant={tempoRestante <= 300 ? 'danger' : 'primary'}
                />
              </div>
            )}

            <div className="p-4">
              {!quizIniciado && !quizConcluido ? (
                /* Quiz Start Screen */
                <div className="text-center py-4">
                  <div className="mb-4">
                    <BsQuestionCircle size={48} className="text-primary mb-3" />
                    <h4>{quiz.descricao}</h4>
                  </div>
                  
                  <Card className="bg-light border-0 mb-4">
                    <Card.Body>
                      <Row className="text-center">
                        <Col md={4}>
                          <div className="mb-2">
                            <Badge bg="primary" className="p-2">
                              <BsQuestionCircle className="me-1" />
                              {quiz.questoes_quizzs?.length || 0}
                            </Badge>
                          </div>
                          <small className="text-muted">Questões</small>
                        </Col>
                        <Col md={4}>
                          <div className="mb-2">
                            <Badge bg="warning" className="p-2">
                              <BsClock className="me-1" />
                              {quiz.limite_tempo || 30}
                            </Badge>
                          </div>
                          <small className="text-muted">Minutos</small>
                        </Col>
                        <Col md={4}>
                          <div className="mb-2">
                            <Badge bg="success" className="p-2">
                              {quiz.nota || 70}%
                            </Badge>
                          </div>
                          <small className="text-muted">Nota Mínima</small>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {jaRespondido ? (
                    <Alert variant="warning" className="text-center">
                      <BsCheckCircle className="me-2" />
                      <strong>Você já respondeu a este quiz!</strong>
                      <div className="mt-2">
                        Nota obtida: <strong>{resultadoAnterior?.nota?.toFixed(1)}%</strong>
                      </div>
                    </Alert>
                  ) : (
                    <>
                      <Alert variant="info" className="text-start">
                        <strong>Instruções:</strong>
                        <ul className="mb-0 mt-2">
                          <li>Leia cada questão cuidadosamente</li>
                          <li>Selecione apenas uma resposta por questão</li>
                          <li>Pode navegar entre as questões</li>
                          <li>O quiz será submetido automaticamente quando o tempo esgotar</li>
                        </ul>
                      </Alert>

                      <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={iniciarQuiz}
                        className="px-5"
                      >
                        Iniciar Quiz
                      </Button>
                    </>
                  )}
                </div>
              ) : quizConcluido && (resultado || resultadoAnterior) ? (
                /* Quiz Results Screen */
                <div className="text-center py-4">
                  {(() => {
                    const resultadoAtual = resultado || resultadoAnterior;
                    const isApproved = resultadoAtual.nota >= (quiz.nota || 70);
                    
                    return (
                      <>
                        <div className="mb-4">
                          {isApproved ? (
                            <BsCheckCircle size={48} className="text-success mb-3" />
                          ) : (
                            <BsXCircle size={48} className="text-danger mb-3" />
                          )}
                          <h4>{jaRespondido ? 'Resultado do Quiz' : 'Quiz Concluído!'}</h4>
                          {jaRespondido && (
                            <small className="text-muted">Você já havia respondido este quiz anteriormente</small>
                          )}
                        </div>

                        <Card className="bg-light border-0 mb-4">
                          <Card.Body>
                            <Row className="text-center">
                              <Col md={4}>
                                <div className="mb-2">
                                  <h3 className={isApproved ? 'text-success' : 'text-danger'}>
                                    {resultadoAtual.nota.toFixed(1)}%
                                  </h3>
                                </div>
                                <small className="text-muted">Nota Final</small>
                              </Col>
                              <Col md={4}>
                                <div className="mb-2">
                                  <h3 className="text-primary">
                                    {resultadoAtual.pontuacao}/{resultadoAtual.totalQuestoes}
                                  </h3>
                                </div>
                                <small className="text-muted">Respostas Corretas</small>
                              </Col>
                              <Col md={4}>
                                <div className="mb-2">
                                  <h3 className="text-info">
                                    {quiz.nota || 70}%
                                  </h3>
                                </div>
                                <small className="text-muted">Nota Mínima</small>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>

                        <Alert 
                          variant={isApproved ? 'success' : 'danger'} 
                          className="d-flex align-items-center"
                        >
                          {isApproved ? (
                            <>
                              <BsCheckCircle className="me-2" />
                              {jaRespondido ? 'Você foi aprovado neste quiz!' : 'Parabéns! Você foi aprovado no quiz.'}
                            </>
                          ) : (
                            <>
                              <BsXCircle className="me-2" />
                              {jaRespondido ? 'Você não atingiu a nota mínima neste quiz.' : 'Não foi desta vez. Você pode tentar novamente mais tarde.'}
                            </>
                          )}
                        </Alert>
                      </>
                    );
                  })()}
                </div>
              ) : quiz.questoes_quizzs && quiz.questoes_quizzs.length > 0 ? (
                /* Quiz Questions */
                <div>
                  {(() => {
                    const questao = quiz.questoes_quizzs[questaoAtual];
                    return (
                      <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                          <h6 className="mb-0">
                            Questão {questaoAtual + 1} de {quiz.questoes_quizzs.length}
                          </h6>
                        </Card.Header>
                        <Card.Body className="p-4">
                          <h5 className="mb-4">{questao.pergunta}</h5>
                          
                          <Form>
                            {questao.opcoes && questao.opcoes.length > 0 ? (
                              questao.opcoes.map((opcao) => (
                                <Card 
                                  key={opcao.opcao_id} 
                                  className={`mb-3 border ${respostas[questao.questao_id] === opcao.opcao_id ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleRespostaChange(questao.questao_id, opcao.opcao_id)}
                                >
                                  <Card.Body className="p-3">
                                    <Form.Check
                                      type="radio"
                                      id={`opcao-${opcao.opcao_id}`}
                                      name={`questao-${questao.questao_id}`}
                                      label={opcao.texto}
                                      checked={respostas[questao.questao_id] === opcao.opcao_id}
                                      onChange={() => handleRespostaChange(questao.questao_id, opcao.opcao_id)}
                                      className="mb-0"
                                    />
                                  </Card.Body>
                                </Card>
                              ))
                            ) : (
                              <Alert variant="warning">Nenhuma opção encontrada para esta questão.</Alert>
                            )}
                          </Form>
                        </Card.Body>
                      </Card>
                    );
                  })()}
                </div>
              ) : (
                <Alert variant="warning" className="text-center">
                  <BsXCircle className="me-2" />
                  Nenhuma questão encontrada neste quiz.
                </Alert>
              )}
            </div>
          </>
        ) : null}
      </Modal.Body>

      {/* Modal Footer with Navigation */}
      {quiz && quizIniciado && !quizConcluido && (
        <Modal.Footer className="border-top bg-light">
          <div className="d-flex justify-content-between w-100">
            <Button 
              variant="outline-secondary" 
              onClick={questaoAnterior}
              disabled={questaoAtual === 0}
            >
              ← Anterior
            </Button>
            
            <div className="d-flex gap-2">
              {questaoAtual === quiz.questoes_quizzs.length - 1 ? (
                <Button 
                  variant="success" 
                  onClick={() => handleSubmitQuiz(false)}
                  disabled={submitting || getRespostasCount() === 0}
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Submetendo...
                    </>
                  ) : (
                    'Submeter Quiz'
                  )}
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={proximaQuestao}
                  disabled={questaoAtual === quiz.questoes_quizzs.length - 1}
                >
                  Próxima →
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      )}

      {/* Close button for completed quiz */}
      {(quizConcluido || (!quizIniciado && !loading && !error)) && (
        <Modal.Footer className="border-top">
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
} 