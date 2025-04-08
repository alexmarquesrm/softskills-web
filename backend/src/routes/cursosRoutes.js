const express = require("express");
const router = express.Router();
const cursosController = require("../controllers/cursosController");

// GET
router.get("/", cursosController.getAllCursos);
router.get("/:id", cursosController.getCursoById);

// POST
router.post("/add", cursosController.createCurso);

// PUT
router.put("/update/:id", cursosController.updateCurso);

// DELETE
router.delete("/delete/:id", cursosController.deleteCurso);

module.exports = router;
