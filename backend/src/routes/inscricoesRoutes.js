const express = require("express");
const router = express.Router();
const inscricoesController = require("../controllers/inscricoesController");

// GET
router.get("/listar", inscricoesController.getAll);
router.get("/listar/:id", inscricoesController.getById);

// POST
router.post("/criar", inscricoesController.create);

// PUT
router.put("/atualizar/:id", inscricoesController.update);

// DELETE
router.delete("/apagar/:id", inscricoesController.delete);

module.exports = router;
