const express = require("express");
const router = express.Router();
const threadsController = require("../controllers/threadsController");

// GET
router.get("/", threadsController.getAllThreads);
router.get("/:id", threadsController.getThreadById);

// POST
router.post("/criar", threadsController.createThread);

// PUT
router.put("/atualizar/:id", threadsController.updateThread);

// DELETE
router.delete("/apagar/:id", threadsController.deleteThread);

module.exports = router;
