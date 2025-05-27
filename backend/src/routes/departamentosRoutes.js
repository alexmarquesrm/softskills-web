const express = require("express");
const router = express.Router();
const { authenticate } = require("../tokenUtils");
const departamentosController = require("../controllers/departamentosController");

// GET - Listar todos os departamentos
router.get("/", authenticate, departamentosController.getAllDepartamentos);

// GET - Obter departamento por ID
router.get("/:id", authenticate, departamentosController.getDepartamentoById);

// POST - Criar novo departamento
router.post("/criar", authenticate, departamentosController.createDepartamento);

// PUT - Atualizar departamento
router.put("/:id", authenticate, departamentosController.updateDepartamento);

// DELETE - Apagar departamento
router.delete("/:id", authenticate, departamentosController.deleteDepartamento);

module.exports = router; 