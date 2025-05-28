const express = require('express');
const router = express.Router();
const { authenticate } = require('../tokenUtils');
const quizzController = require('../controllers/quizzController');

// GET /quizz/curso/:cursoId - Buscar todos os quizzes de um curso
router.get('/curso/:cursoId', quizzController.getQuizzesByCurso);

// POST /quizz - Criar um novo quiz
router.post('/', authenticate, quizzController.createQuiz);

// PUT /quizz/:quizzId - Atualizar um quiz existente
router.put('/:quizzId', authenticate, quizzController.updateQuiz);

// DELETE /quizz/:quizzId - Deletar um quiz
router.delete('/:quizzId', authenticate, quizzController.deleteQuiz);

// POST /quizz/:quizzId/respostas - Submeter respostas de um quiz
router.post('/:quizzId/respostas', authenticate, quizzController.submitQuizAnswers);

// GET /quizz/:quizzId - Buscar um quiz específico com perguntas e opções
router.get('/:quizzId', quizzController.getQuizById);

// GET /quizz/:quizzId/completion - Verificar se o formando já respondeu ao quiz
router.get('/:quizzId/completion', authenticate, quizzController.checkQuizCompletion);

module.exports = router; 