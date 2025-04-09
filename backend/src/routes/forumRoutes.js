const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");

// GET
router.get("/", forumController.getAllForums);
router.get("/:id", forumController.getForumById);

// POST
router.post("/criar", forumController.createForum);

// PUT
router.put("/update/:id", forumController.updateForum);

// DELETE
router.delete("/apagar/:id", forumController.deleteForum);

module.exports = router;
