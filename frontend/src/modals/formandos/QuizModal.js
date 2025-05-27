import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "../../config/configAxios";

export default function QuizModal({ show, onHide, quizId }) {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show || !quizId) return;
    setLoading(true);
    setError(null);
    setQuiz(null);
    console.log("QuizModal opened for quizId:", quizId);
    axios.get(`/quizz/${quizId}`)
      .then(res => {
        if (res.data && res.data.success) {
          setQuiz(res.data.data);
          console.log("Quiz data loaded:", res.data.data);
        } else {
          setError("Erro ao carregar quiz");
        }
      })
      .catch(err => {
        setError("Erro ao carregar quiz");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [show, quizId]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">A carregar quiz...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : quiz ? (
          <div>
            <h5>{quiz.descricao}</h5>
            {quiz.questoes_quizzs && quiz.questoes_quizzs.length > 0 ? (
              quiz.questoes_quizzs.map((questao, idx) => (
                <div key={questao.questao_id} className="mb-4">
                  <b>Pergunta {idx + 1}:</b> {questao.pergunta}
                  <Form>
                    {questao.opcoes && questao.opcoes.length > 0 ? (
                      questao.opcoes.map((opcao, oidx) => (
                        <Form.Check
                          key={opcao.opcao_id}
                          type="radio"
                          name={`questao_${questao.questao_id}`}
                          label={
                            <>
                              {opcao.texto}
                              {opcao.correta && (
                                <span style={{ color: 'green', marginLeft: 8, fontWeight: 'bold' }}>
                                  (Correta)
                                </span>
                              )}
                            </>
                          }
                          // checked, onChange etc. para submissão futura
                        />
                      ))
                    ) : (
                      <div className="text-muted">Nenhuma opção encontrada.</div>
                    )}
                  </Form>
                </div>
              ))
            ) : (
              <div className="text-muted">Nenhuma pergunta encontrada.</div>
            )}
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Fechar</Button>
        {/* Botão de submeter respostas pode ser adicionado depois */}
      </Modal.Footer>
    </Modal>
  );
} 