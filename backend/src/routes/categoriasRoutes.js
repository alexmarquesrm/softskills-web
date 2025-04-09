const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categoriasController");

// GET
router.get("/", categoriasController.getAllCategorias);
router.get("/:id", categoriasController.getCategoriaById);

// POST
router.post("/criar", categoriasController.createCategoria);

// PUT
router.put("/atualizar/:id", categoriasController.updateCategoria);

// DELETE
router.delete("/apagar/:id", categoriasController.deleteCategoria);

module.exports = router;
