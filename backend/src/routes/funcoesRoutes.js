const express = require("express");
const router = express.Router();
const { authenticate } = require("../tokenUtils");
const funcoesController = require("../controllers/funcoesController");

// GET - Listar todas as funções
router.get("/", authenticate, funcoesController.getAllFuncoes);

// GET - Obter função por ID
router.get("/:id", authenticate, funcoesController.getFuncaoById);

// POST - Criar nova função
router.post("/criar", authenticate, funcoesController.createFuncao);

// PUT - Atualizar função
router.put("/:id", authenticate, funcoesController.updateFuncao);

// DELETE - Apagar função
router.delete("/:id", authenticate, funcoesController.deleteFuncao);

module.exports = router; 