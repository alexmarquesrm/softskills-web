const express = require("express");
const router = express.Router();
const { authenticate } = require("../tokenUtils");
const colaboradorController = require("../controllers/colaboradoresController");

// GET
router.get("/", authenticate, colaboradorController.getAllColaboradores);
router.get("/:id", authenticate, colaboradorController.getColaboradorById);
router.get("/username/:username", colaboradorController.getUserByLogin);
router.get('/token/:id', colaboradorController.novoToken);

// POST
router.post("/registo", colaboradorController.registarNovoColaborador);
router.post("/adicionar", authenticate, colaboradorController.criarColaborador);
router.post('/login', colaboradorController.login);

// PUT
router.put("/atualizar/:id", authenticate, colaboradorController.updateColaborador);

// DEL
router.delete("/apagar/:id", authenticate, colaboradorController.deleteColaborador);

module.exports = router;
