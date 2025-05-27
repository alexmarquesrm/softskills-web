const express = require("express");
const router = express.Router();
const threadsDenController = require("../controllers/threadsDenController");

// GET
router.get("/", threadsDenController.getAllDenuncias);
router.get("/:denuncia_id", threadsDenController.getDenunciaById);
router.get("/verificar/:thread_id/:formando_id", threadsDenController.checkDenunciaExistente);

// POST
router.post("/criar", threadsDenController.createDenuncia);
// PUT

// DELETE
router.delete("/apagar/:denuncia_id", threadsDenController.deleteDenuncia);

module.exports = router;
