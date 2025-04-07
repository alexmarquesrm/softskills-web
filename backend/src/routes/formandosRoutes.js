const express = require("express");
const router = express.Router();
const formandoController = require("../controllers/formandosController");

// GET
router.get("/", formandoController.getAllFormandos);
router.get("/:id", formandoController.getFormandoById);

// POST
router.post("/", formandoController.createFormando);

// PUT
router.put("/:id", formandoController.updateFormando);

// DEL
router.delete("/:id", formandoController.deleteFormando);

module.exports = router;
