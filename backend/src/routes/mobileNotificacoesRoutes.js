const express = require("express");
const router = express.Router();
const mobileNotificacoesController = require("../controllers/mobileNotificacoesController");
// Adicione autenticação se necessário

router.get("/", mobileNotificacoesController.getNotificacoes);
router.post("/marcar-lida", mobileNotificacoesController.marcarComoLida);
router.post("/teste-push", mobileNotificacoesController.testePush);

module.exports = router; 