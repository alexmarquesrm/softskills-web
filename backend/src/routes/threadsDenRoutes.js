const express = require("express");
const router = express.Router();
const threadsDenController = require("../controllers/threadsDenController");

// GET
router.get("/", threadsDenController.getAllDenuncias);
router.get("/:denuncia_id", threadsDenController.getDenunciaById);

// POST
router.post("/add", threadsDenController.createDenuncia);
// PUT

// DELETE
router.delete("/:denuncia_id", threadsDenController.deleteDenuncia);

module.exports = router;
