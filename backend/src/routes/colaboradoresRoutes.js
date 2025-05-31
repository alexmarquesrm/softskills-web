const express = require("express");
const router = express.Router();
const { authenticate, validateResourceAccess } = require("../tokenUtils");
const colaboradorController = require("../controllers/colaboradoresController");

// Rotas públicas (sem autenticação)
router.get("/firebase-config", colaboradorController.getFirebaseConfig);
router.get("/username/:username", colaboradorController.getUserByLogin);
router.post("/registo", colaboradorController.registarNovoColaborador);
router.post('/login', colaboradorController.login);
router.post('/mobile-login', colaboradorController.mobileLogin);
router.post('/reset-password', colaboradorController.resetPassword);
router.post("/google-login", colaboradorController.googleLogin);
router.post("/google-mobile-login", colaboradorController.googleMobileLogin);

// Rota para obter saudação baseada na hora do dia
router.get("/saudacao", colaboradorController.getSaudacao);

// Rotas protegidas que exigem autenticação
router.get("/me", authenticate, colaboradorController.getMe);
router.get("/", authenticate, colaboradorController.getAllColaboradores);
router.get("/:id", authenticate, validateResourceAccess, colaboradorController.getColaboradorById);
router.get('/token/:id', authenticate, validateResourceAccess, colaboradorController.novoToken);
router.post("/adicionar", authenticate, colaboradorController.criarColaborador);
router.put("/atualizar/:id", authenticate, validateResourceAccess, colaboradorController.updateColaborador);
router.delete("/apagar/:id", authenticate, validateResourceAccess, colaboradorController.deleteColaborador);
router.post('/change-password', authenticate, colaboradorController.changePassword);

module.exports = router;