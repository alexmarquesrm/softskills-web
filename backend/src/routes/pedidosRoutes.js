const express = require("express");
const router = express.Router();
const controladorPedidos = require("../controllers/pedidosController");

// Rota para criar um novo pedido
router.post("/", controladorPedidos.createPedido);

// Rota para obter todos os pedidos
router.get("/", controladorPedidos.getAllPedidos);

// Rota para obter pedidos por tipo
router.get("/tipo/:tipo", controladorPedidos.getPedidosByTipo);

// Rota para obter um pedido específico
router.get("/:pedido_id", controladorPedidos.getPedidoById);

// Rota para atualizar um pedido
router.put("/:pedido_id", controladorPedidos.updatePedido);

// Rota para remover um pedido
router.delete("/:pedido_id", controladorPedidos.deletePedido);

module.exports = router;
