const express = require("express");
const router = express.Router();
const areaController = require("../controllers/areasController");

// GET
router.get("/", areaController.getAllAreas);
router.get("/:id", areaController.getAreaById);

// POST
router.post("/", areaController.createArea);

// PUT
router.put("/:id", areaController.updateArea);

// DELETE
router.delete("/:id", areaController.deleteArea);

module.exports = router;
