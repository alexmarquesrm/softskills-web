const express = require("express");
const router = express.Router();
const mobileColaboradoresController = require("../controllers/mobileColaboradoresController");

router.post("/registrar-fcm-token", mobileColaboradoresController.registrarFcmToken);
router.get("/perfil", mobileColaboradoresController.getPerfil);

module.exports = router; 