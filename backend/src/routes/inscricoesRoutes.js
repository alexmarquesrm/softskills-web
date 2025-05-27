const express = require("express");
const router = express.Router();
const inscricoesController = require("../controllers/inscricoesController");

// Rota para obter as próprias inscrições do usuário autenticado
router.get("/minhas", inscricoesController.getMyInscricoes);

// Rota para listar todas as inscrições (apenas gestor)
router.get("/listar", inscricoesController.getAll);

// Rota para obter inscrições de um formando específico
router.get("/formando/:id", inscricoesController.getByFormandoId);

// Rota para obter uma inscrição específica pelo ID
router.get("/:id", inscricoesController.getById);

// Rota para criar uma nova inscrição
router.post("/criar", inscricoesController.create);

// Rota para atualizar uma inscrição
router.put("/atualizar/:id", inscricoesController.update);

// Rota para excluir uma inscrição
router.delete("/apagar/:id", inscricoesController.delete);

module.exports = router;