const express = require("express");
const router = express.Router();
const sincronosController = require("../controllers/sincronosController");

// GET
router.get("/", sincronosController.getAllSincronos);
router.get("/:id", sincronosController.getSincronoById);

// POST
router.post("/criar", sincronosController.createSincrono);

// PUT
router.put("/atualizar/:id", sincronosController.updateSincrono);

// DELETE
router.delete("/apagar/:id", sincronosController.deleteSincrono);

module.exports = router;
