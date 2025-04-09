const express = require("express");
const router = express.Router();
const topicosController = require("../controllers/topicosController");

// GET
router.get("/", topicosController.getAllTopicos);
router.get("/:id", topicosController.getTopicoById);

// POST
router.post("/criar", topicosController.createTopico);

// PUT 
router.put("/atualizar/:id", topicosController.updateTopico);

// DELETE
router.delete("/apagar/:id", topicosController.deleteTopico);


module.exports = router;

