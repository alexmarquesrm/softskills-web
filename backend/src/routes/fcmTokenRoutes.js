const express = require('express');
const router = express.Router();
const fcmTokenController = require('../controllers/fcmTokenController');
const { authenticate } = require('../tokenUtils');

// Verificar token
router.get('/verificar-fcm-token/:colaboradorId', authenticate, fcmTokenController.verificarToken);

// Registrar token
router.post('/registrar-fcm-token', authenticate, fcmTokenController.registrarToken);

// Desativar token
router.post('/desativar-fcm-token', authenticate, fcmTokenController.desativarToken);

module.exports = router; 