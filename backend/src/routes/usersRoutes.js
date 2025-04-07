const express = require("express");
const router = express.Router();
const colaboradorController = require("../controllers/usersController");

// GET
router.get("/", colaboradorController.getAllColaboradores);
router.get("/:id", colaboradorController.getColaboradorById);

// POST
router.post("/", colaboradorController.createColaborador);

// PUT
router.put("/:id", colaboradorController.updateColaborador);

// DEL

module.exports = router;
