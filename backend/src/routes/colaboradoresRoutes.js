const express = require("express");
const router = express.Router();
const colaboradorController = require("../controllers/colaboradoresController");

// GET
router.get("/", colaboradorController.getAllColaboradores);
router.get("/:id", colaboradorController.getColaboradorById);

// POST
router.post("/criar", colaboradorController.createColaborador);

// PUT
router.put("/atualizar/:id", colaboradorController.updateColaborador);

// DEL
router.delete("/apagar/:id", colaboradorController.deleteColaborador);

module.exports = router;
