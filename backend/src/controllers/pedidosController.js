const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorPedidos = {
  // Criar novo pedido
  createPedido: async (req, res) => {
    const { colaborador_id, tipo, referencia_id } = req.body;
    try {
      const novoPedido = await models.pedidos.create({ 
        colaborador_id, 
        tipo,
        referencia_id,
        data: new Date()
      });
      res.status(201).json(novoPedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar pedido" });
    }
  },

  // Obter todos os pedidos
  getAllPedidos: async (req, res) => {
    try {
      const pedidos = await models.pedidos.findAll({
        include: [
          {
            model: models.colaborador,
            as: "ped_colaborador",
            attributes: ["nome"]
          }
        ]
      });
      res.status(200).json(pedidos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar pedidos" });
    }
  },

  // Obter pedidos por tipo
  getPedidosByTipo: async (req, res) => {
    const { tipo } = req.params;
    try {
      const pedidos = await models.pedidos.findAll({
        where: { tipo },
        include: [
          {
            model: models.colaborador,
            as: "ped_colaborador",
            attributes: ["nome"]
          }
        ]
      });
      res.status(200).json(pedidos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar pedidos" });
    }
  },

  // Obter um pedido específico
  getPedidoById: async (req, res) => {
    const { pedido_id } = req.params;
    try {
      const pedido = await models.pedidos.findOne({
        where: { pedido_id },
        include: [
          {
            model: models.colaborador,
            as: "ped_colaborador",
            attributes: ["nome"]
          }
        ]
      });

      if (!pedido) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      res.status(200).json(pedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar pedido" });
    }
  },

  // Atualizar um pedido
  updatePedido: async (req, res) => {
    const { pedido_id } = req.params;
    const { tipo, referencia_id } = req.body;

    try {
      const pedido = await models.pedidos.findOne({
        where: { pedido_id }
      });

      if (!pedido) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      await pedido.update({
        tipo: tipo ?? pedido.tipo,
        referencia_id: referencia_id ?? pedido.referencia_id
      });

      res.status(200).json(pedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar pedido" });
    }
  },

  // Remover um pedido
  deletePedido: async (req, res) => {
    const { pedido_id } = req.params;

    try {
      const pedido = await models.pedidos.findOne({
        where: { pedido_id }
      });

      if (!pedido) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      await pedido.destroy();
      res.status(200).json({ message: "Pedido removido com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover pedido" });
    }
  }
};

module.exports = controladorPedidos;
