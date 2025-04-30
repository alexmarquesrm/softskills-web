const express = require("express");
const router = express.Router();
const formadoresController = require("../controllers/formadoresController");
const { route } = require("./formandosRoutes");

// GET
router.get("/", formadoresController.getAllFormadores);
router.get("/totalformadores", formadoresController.getCountFormadores);
router.get("/:id", formadoresController.getFormadorById);

// POST
router.post("/criar", formadoresController.createFormador);

// PUT
router.put("/atualizar/:id", formadoresController.updateFormador);

// DEL
router.delete("/apagar/:id", formadoresController.deleteFormador);

module.exports = router;
