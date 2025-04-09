const express = require("express");
const router = express.Router();
const formandoController = require("../controllers/formandosController");

// GET
router.get("/", formandoController.getAllFormandos);
router.get("/:id", formandoController.getFormandoById);

// POST
router.post("/criar", formandoController.createFormando);

// PUT
router.put("/atualizar/:id", formandoController.updateFormando);

// DEL
router.delete("/apagar/:id", formandoController.deleteFormando);

module.exports = router;
