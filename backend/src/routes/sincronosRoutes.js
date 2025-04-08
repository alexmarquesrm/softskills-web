const express = require("express");
const router = express.Router();
const sincronosController = require("../controllers/sincronosController");

// GET
router.get("/", sincronosController.getAllSincronos);
router.get("/:id", sincronosController.getSincronoById);

// POST
router.post("/add", sincronosController.createSincrono);

// PUT
router.put("/:id", sincronosController.updateSincrono);

// DELETE
router.delete("/:id", sincronosController.deleteSincrono);

module.exports = router;
