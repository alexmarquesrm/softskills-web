const express = require('express');
const router = express.Router();
const controladorAvaliacaoFormador = require('../controllers/avaliacao_formador.controller');

// Criar uma nova avaliação
router.post('/', controladorAvaliacaoFormador.createAvaliacao);

// Recuperar todas as avaliações
router.get('/', controladorAvaliacaoFormador.getAllAvaliacoes);

// Recuperar avaliações de um formador específico
router.get('/formador/:formador_id', controladorAvaliacaoFormador.getAvaliacoesByFormador);

// Recuperar uma avaliação específica
router.get('/:id', controladorAvaliacaoFormador.getAvaliacaoById);

// Atualizar uma avaliação
router.put('/:id', controladorAvaliacaoFormador.updateAvaliacao);

// Deletar uma avaliação
router.delete('/:id', controladorAvaliacaoFormador.deleteAvaliacao);

// Deletar todas as avaliações
router.delete('/', controladorAvaliacaoFormador.deleteAllAvaliacoes);

module.exports = router; 