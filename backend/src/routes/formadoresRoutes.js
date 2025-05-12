const express = require("express");
const router = express.Router();
const { authenticate } = require("../tokenUtils");
const formadoresController = require("../controllers/formadoresController");
const { route } = require("./formandosRoutes");

// GET
router.get("/", authenticate, formadoresController.getAllFormadores);
router.get("/totalformadores", formadoresController.getCountFormadores);
router.get("/:id", authenticate, formadoresController.getFormadorById);

// POST
router.post("/criar", authenticate, formadoresController.createFormador);

// PUT
router.put("/atualizar/:id", authenticate, formadoresController.updateFormador);

// DEL
router.delete("/apagar/:id", authenticate, formadoresController.deleteFormador);

module.exports = router;
