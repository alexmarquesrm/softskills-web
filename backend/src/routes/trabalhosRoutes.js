const express = require("express");
const router = express.Router();
const trabalhosController = require("../controllers/trabalhosController");
const { authenticate } = require("../tokenUtils");

// GET
router.get("/formandos", authenticate, trabalhosController.getTrabalhosFormandos);

// POST
router.post("/avaliar", authenticate, trabalhosController.avaliarTrabalho);

module.exports = router; 