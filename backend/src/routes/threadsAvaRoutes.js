const express = require("express");
const router = express.Router();
const threadsAvaController = require("../controllers/threadsAvaController");

// GET
router.get("/", threadsAvaController.getAllThreadAvaliacoes);
router.get("/:thread_id", threadsAvaController.getThreadAvaliacaoById);
router.get("/:thread_id/:formando_id", threadsAvaController.getThreadAvaliacaoFormandoById);

// POST
router.post("/criar", threadsAvaController.createThreadAvaliacao);

// PUT
router.put("/atualizar/:thread_id/:formando_id", threadsAvaController.updateThreadAvaliacao);

// DEL
router.delete("/apagar/:thread_id/:formando_id", threadsAvaController.deleteThreadAvaliacao);

module.exports = router;
