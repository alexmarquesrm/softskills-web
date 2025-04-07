const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");

// GET
router.get("/", forumController.getAllForums);
router.get("/:id", forumController.getForumById);

// POST
router.post("/", forumController.createForum);

// PUT
router.put("/:id", forumController.updateForum);

// DELETE
router.delete("/:id", forumController.deleteForum);

module.exports = router;
