const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categoriasController");

// GET todas as categorias
router.get("/", categoriasController.getAllCategorias);

// GET categoria por ID
router.get("/:id", categoriasController.getCategoriaById);

// POST nova categoria
router.post("/", categoriasController.createCategoria);

// PUT atualizar categoria
router.put("/:id", categoriasController.updateCategoria);

// DELETE apagar categoria
router.delete("/:id", categoriasController.deleteCategoria);

module.exports = router;
