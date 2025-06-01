const express = require("express");
const router = express.Router();
const { authenticate, validateResourceAccess } = require("../tokenUtils");
const { controladorUtilizadores, controladorMobile } = require("../controllers/colaboradoresController");

// Rotas públicas (sem autenticação)
router.get("/firebase-config", controladorUtilizadores.getFirebaseConfig);
router.get("/username/:username", controladorUtilizadores.getUserByLogin);
router.post("/login", controladorUtilizadores.login);
router.post("/registo", controladorUtilizadores.registarNovoColaborador);
router.post("/reset-password", controladorUtilizadores.resetPassword);

// Rotas mobile (sem autenticação)
router.post('/mobile-login', controladorMobile.mobileLogin);
router.post("/google-mobile-login", controladorMobile.googleMobileLogin);
router.post("/registrar-fcm-token", controladorMobile.registrarFcmToken);

// Rotas protegidas que exigem autenticação
router.get("/me", authenticate, controladorUtilizadores.getMe);
router.get("/", authenticate, controladorUtilizadores.getAllColaboradores);
router.get("/:id", authenticate, validateResourceAccess, controladorUtilizadores.getColaboradorById);
router.post("/adicionar", authenticate, controladorUtilizadores.criarColaborador);
router.put("/:id", authenticate, validateResourceAccess, controladorUtilizadores.updateColaborador);
router.delete("/:id", authenticate, controladorUtilizadores.deleteColaborador);
router.post("/change-password", authenticate, controladorUtilizadores.changePassword);

// Rotas mobile protegidas
router.post("/mobile/change-password", authenticate, controladorMobile.mobileChangePassword);

module.exports = router;