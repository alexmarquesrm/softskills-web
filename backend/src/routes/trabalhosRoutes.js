const express = require("express");
const router = express.Router();
const trabalhosController = require("../controllers/trabalhosController");
const { authenticate } = require("../tokenUtils");

// GET
router.get("/formandos", authenticate, trabalhosController.getTrabalhosFormandos);
router.get("/pendentes", authenticate, trabalhosController.getTrabalhosPendentesFormando);
router.get("/avaliacao/:avaliacaoId/curso/:cursoId", authenticate, trabalhosController.getSubmissaoExistente);
router.get("/avaliacao/:avaliacaoId/curso/:cursoId/submissoes", authenticate, trabalhosController.getSubmissoesPorAvaliacao);

// POST
router.post("/avaliar", authenticate, trabalhosController.avaliarTrabalho);

// NOVA ROTA PARA SUBMISSÃO DE TRABALHO
router.post("/submeter", authenticate, trabalhosController.submeterTrabalho);

// DELETE
router.delete("/:trabalhoId", authenticate, trabalhosController.apagarTrabalho);

module.exports = router; 