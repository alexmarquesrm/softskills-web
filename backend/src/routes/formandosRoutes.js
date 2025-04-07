const express = require("express");
const router = express.Router();
const formandoController = require("../controllers/formandosController");

// GET
router.get("/", formandoController.getAllFormandos);

// POST

// PUT

// DEL

module.exports = router;
