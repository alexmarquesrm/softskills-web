const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorPedidosForum = {
  // Criar novo pedido_forum
  createPedidoForum: async (req, res) => {
    const { colaborador_id, topico_id } = req.body;
    try {
      const novoPedido = await models.pedido_forum.create({ 
        colaborador_id, 
        topico_id,
        data: new Date()
      });
      res.status(201).json(novoPedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar pedido_forum" });
    }
  },

  // Obter todos os pedidos_forum
  getAllPedidosForum: async (req, res) => {
    try {
      const pedidos = await models.pedido_forum.findAll({
        include: [
          {
            model: models.topico,
            as: "ped_topico"
          },
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
      res.status(500).json({ message: "Erro ao procurar pedidos de fórum" });
    }
  },

  // Obter um pedido_forum específico
  getPedidoForumById: async (req, res) => {
    const { colaborador_id, topico_id } = req.params;
    try {
      const pedido = await models.pedido_forum.findOne({
        where: { colaborador_id, topico_id },
        include: [
          {
            model: models.topico,
            as: "ped_topico"
          },
          {
            model: models.colaborador,
            as: "ped_colaborador",
            attributes: ["nome"]
          }
        ]
      });

      if (!pedido) {
        return res.status(404).json({ message: "Pedido_forum não encontrado" });
      }

      res.status(200).json(pedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar pedido_forum" });
    }
  },

  // Atualizar um pedido_forum
  updatePedidoForum: async (req, res) => {
    const { colaborador_id, topico_id } = req.params;
    const { novo_colaborador_id, novo_topico_id } = req.body;

    try {
      const pedido = await models.pedido_forum.findOne({
        where: { colaborador_id, topico_id }
      });

      if (!pedido) {
        return res.status(404).json({ message: "Pedido_forum não encontrado" });
      }

      await pedido.update({
        colaborador_id: novo_colaborador_id ?? colaborador_id,
        topico_id: novo_topico_id ?? topico_id
      });

      res.status(200).json(pedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar pedido_forum" });
    }
  },

  // Remover um pedido_forum
  deletePedidoForum: async (req, res) => {
    const { colaborador_id, topico_id } = req.params;

    try {
      const pedido = await models.pedido_forum.findOne({
        where: { colaborador_id, topico_id }
      });

      if (!pedido) {
        return res.status(404).json({ message: "Pedido_forum não encontrado" });
      }

      await pedido.destroy();
      res.status(200).json({ message: "Pedido_forum removido com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover pedido_forum" });
    }
  }
};

module.exports = controladorPedidosForum; 