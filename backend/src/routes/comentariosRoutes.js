const express = require("express");
const router = express.Router();
const controladorComentarios = require("../controllers/comentariosController");

// GET /comentarios/thread/:thread_id
router.get("/thread/:thread_id", controladorComentarios.getComentariosByThread);

// POST /comentarios/criar
router.post("/criar", controladorComentarios.createComentario);

// PUT /comentarios/atualizar/:id
router.put("/atualizar/:id", controladorComentarios.updateComentario);

// DELETE /comentarios/apagar/:id
router.delete("/apagar/:id", controladorComentarios.deleteComentario);

module.exports = router; 