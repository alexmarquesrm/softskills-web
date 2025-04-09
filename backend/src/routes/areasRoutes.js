const express = require("express");
const router = express.Router();
const areaController = require("../controllers/areasController");

// GET
router.get("/", areaController.getAllAreas);
router.get("/:id", areaController.getAreaById);

// POST
router.post("/criar", areaController.createArea);

// PUT
router.put("/atualizar/:id", areaController.updateArea);

// DELETE
router.delete("/apagar/:id", areaController.deleteArea);

module.exports = router;
