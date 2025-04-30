const express = require("express");
const router = express.Router();
const { authenticate } = require("../tokenUtils");
const formandoController = require("../controllers/formandosController");

// GET
router.get("/", authenticate, formandoController.getAllFormandos);
router.get("/totalformandos", formandoController.getCountFormandos);
router.get("/:id", authenticate, formandoController.getFormandoById);

// POST
router.post("/criar", authenticate, formandoController.createFormando);

// PUT
router.put("/atualizar/:id", authenticate, formandoController.updateFormando);

// DEL
router.delete("/apagar/:id", authenticate, formandoController.deleteFormando);

module.exports = router;
