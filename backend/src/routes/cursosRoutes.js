const express = require("express");
const router = express.Router();
const cursosController = require("../controllers/cursosController");

// GET
router.get("/", cursosController.getAllCursos);
router.get("/:id", cursosController.getCursoById);

// POST
router.post("/criar", cursosController.createCurso);

// PUT
router.put("/atualizar/:id", cursosController.updateCurso);

// DELETE
router.delete("/apagar/:id", cursosController.deleteCurso);

module.exports = router;
