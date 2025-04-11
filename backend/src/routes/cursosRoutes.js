const express = require("express");
const router = express.Router();
const { authenticate } = require("../tokenUtils");
const cursosController = require("../controllers/cursosController");

// GET
router.get("/", authenticate, cursosController.getAllCursos);
router.get("/landing", cursosController.getAllCursos);
router.get("/:id", authenticate, cursosController.getCursoById);

// POST
router.post("/criar", authenticate, cursosController.createCurso);

// PUT
router.put("/atualizar/:id", authenticate, cursosController.updateCurso);

// DELETE
router.delete("/apagar/:id", authenticate, cursosController.deleteCurso);

module.exports = router;
