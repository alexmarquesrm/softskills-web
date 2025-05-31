const express = require("express");
const router = express.Router();
const { authenticate } = require("../tokenUtils");
const cursosController = require("../controllers/cursosController");

// GET
router.get("/", authenticate, cursosController.getAllCursos);
router.get("/listpublic", cursosController.getAllCursosPublic);
router.get("/landing", cursosController.getAllLanding);
router.get("/totalcursos", cursosController.getCountCursos);
router.get("/:id", authenticate, cursosController.getCursoById);
router.get("/formador/:id", authenticate, cursosController.getCursosFormador);
router.get("/:id/alunos", authenticate, cursosController.getAlunosInscritos);

// POST
router.post("/criar", authenticate, cursosController.createCurso);

// PUT
router.put("/atualizar/:id", authenticate, cursosController.updateCurso);

// DELETE
router.delete("/apagar/:id", authenticate, cursosController.deleteCurso);

module.exports = router;
