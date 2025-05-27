const express = require("express");
const router = express.Router();
const { authenticate } = require("../tokenUtils");
const notificacaoController = require("../controllers/notificacaoController");

// GET
router.get("/formando/:formandoId", authenticate, notificacaoController.getNotificacoesFormando);

// PUT
router.put("/:notificacaoId/lida", authenticate, notificacaoController.marcarNotificacaoComoLida);
router.put("/marcar-todas-lidas", authenticate, notificacaoController.marcarTodasNotificacoesComoLidas);

// POST
router.post("/processar-inicio-curso", authenticate, notificacaoController.processarNotificacoesInicioCurso);

module.exports = router; 