const express = require("express");
const router = express.Router();
const topicosController = require("../controllers/topicosController");

// GET
router.get("/", topicosController.getAllTopicos);
router.get("/:id", topicosController.getTopicoById);

// POST
router.post("/", topicosController.createTopico);

// PUT 
router.put("/:id", topicosController.updateTopico);

// DELETE
router.delete("/:id", topicosController.deleteTopico);


module.exports = router;

