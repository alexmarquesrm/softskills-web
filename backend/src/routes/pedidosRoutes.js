const express = require("express");
const router = express.Router();
const controladorPedidos = require("../controllers/pedidosController");

// Rota para criar um novo pedido
router.post("/", controladorPedidos.createPedido);

// Rota para obter todos os pedidos (incluindo pedidos de fórum)
router.get("/", controladorPedidos.getAllPedidos);

// Rota para obter pedidos por tipo (CURSO ou FORUM)
router.get("/tipo/:tipo", controladorPedidos.getPedidosByTipo);

// Rota para obter um pedido específico (pode ser pedido normal ou de fórum)
router.get("/:pedido_id", controladorPedidos.getPedidoById);

// Rota para atualizar um pedido (pode ser pedido normal ou de fórum)
router.put("/:pedido_id", controladorPedidos.updatePedido);

// Rota para remover um pedido (pode ser pedido normal ou de fórum)
router.delete("/:pedido_id", controladorPedidos.deletePedido);

module.exports = router;
