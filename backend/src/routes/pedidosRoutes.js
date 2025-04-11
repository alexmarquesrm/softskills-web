const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidosController");

// GET
router.get("/", pedidoController.getAllPedidosCurso);
router.get("/:id", pedidoController.getPedidoCursoById);

// POST
router.post("/criar", pedidoController.createPedidoCurso);

// PUT
router.put("/atualizar", pedidoController.updatePedidoCurso);

// DELETE
router.delete("/apagar", pedidoController.deletePedidoCurso);

module.exports = router;
