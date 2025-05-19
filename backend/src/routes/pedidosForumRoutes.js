const express = require("express");
const router = express.Router();
const controladorPedidosForum = require("../controllers/pedidosForumController");

// Rota para criar um novo pedido_forum
router.post("/", controladorPedidosForum.createPedidoForum);

// Rota para obter todos os pedidos_forum
router.get("/", controladorPedidosForum.getAllPedidosForum);

// Rota para obter um pedido_forum específico
router.get("/:colaborador_id/:topico_id", controladorPedidosForum.getPedidoForumById);

// Rota para atualizar um pedido_forum
router.put("/:colaborador_id/:topico_id", controladorPedidosForum.updatePedidoForum);

// Rota para remover um pedido_forum
router.delete("/:colaborador_id/:topico_id", controladorPedidosForum.deletePedidoForum);

module.exports = router; 