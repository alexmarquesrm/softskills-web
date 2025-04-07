const express = require("express");
const router = express.Router();
const threadsController = require("../controllers/threadsController");

// GET
router.get("/", threadsController.getAllThreads);
router.get("/:id", threadsController.getThreadById);

// POST
router.post("/", threadsController.createThread);

// PUT
router.put("/:id", threadsController.updateThread);

// DELETE
router.delete("/:id", threadsController.deleteThread);

module.exports = router;
