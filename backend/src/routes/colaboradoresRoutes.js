const express = require("express");
const router = express.Router();
const { authenticate, validateResourceAccess } = require("../tokenUtils");
const colaboradorController = require("../controllers/colaboradoresController");

// Rota para obter o próprio perfil - usa o ID do token JWT
router.get("/me", authenticate, colaboradorController.getMe);

// Rotas públicas (sem autenticação) - para login/registro
router.get("/username/:username", colaboradorController.getUserByLogin);
router.post("/registo", colaboradorController.registarNovoColaborador);
router.post('/login', colaboradorController.login);

// Rotas protegidas que exigem autenticação
// Listar todos colaboradores (apenas admin/gestor)
router.get("/", authenticate, colaboradorController.getAllColaboradores);

// Obter colaborador pelo ID (apenas admin/gestor ou o próprio usuário)
router.get("/:id", authenticate, validateResourceAccess, colaboradorController.getColaboradorById);

// Gerar token (função mantida para compatibilidade, mas protegida)
router.get('/token/:id', authenticate, validateResourceAccess, colaboradorController.novoToken);

// Adicionar novo colaborador (apenas admin/gestor)
router.post("/adicionar", authenticate, colaboradorController.criarColaborador);

// Atualizar colaborador (apenas admin/gestor ou o próprio usuário)
router.put("/atualizar/:id", authenticate, validateResourceAccess, colaboradorController.updateColaborador);

// Excluir colaborador (apenas admin/gestor)
router.delete("/apagar/:id", authenticate, validateResourceAccess, colaboradorController.deleteColaborador);

module.exports = router;