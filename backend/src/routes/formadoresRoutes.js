const express = require("express");
const router = express.Router();
const formadoresController = require("../controllers/formadoresController");
const { route } = require("./formandosRoutes");

// GET
router.get("/", formadoresController.getAllFormadores);
router.get("/:id", formadoresController.getFormadorById);

// POST
router.post("/", formadoresController.createFormador);

// PUT
router.put("/:id", formadoresController.updateFormador);

// DEL
router.delete("/:id", formadoresController.deleteFormador);

module.exports = router;
