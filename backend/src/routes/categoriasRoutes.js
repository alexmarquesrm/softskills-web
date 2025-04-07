const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categoriasController");

// GET
router.get("/", categoriasController.getAllCategorias);
router.get("/:id", categoriasController.getCategoriaById);

// POST
router.post("/", categoriasController.createCategoria);

// PUT
router.put("/:id", categoriasController.updateCategoria);

// DELETE
router.delete("/:id", categoriasController.deleteCategoria);

module.exports = router;
