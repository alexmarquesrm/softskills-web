const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const pedido_curso = require("../models/pedido_curso");
const models = initModels(sequelizeConn);

const controladorPedidos = {
  // Criar novo pedido_curso
  createPedidoCurso: async (req, res) => {
    const { formador_id, curso_id } = req.body;
    console.log("Dados recebidos:", req.body);
    try {
      const novoPedido = await models.pedido_curso.create({ formador_id, curso_id });
      res.status(201).json(novoPedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar pedido_curso" });
    }
  },

  // Obter todos os pedidos_curso
  getAllPedidosCurso: async (req, res) => {
    try {
      const pedidos = await models.pedido_curso.findAll({
        include: [
          {
            model: models.curso,
            as: "ped_curso"
          },
          {
            model: models.formador,
            as: "ped_formador",
            include: [
              {
                model: models.colaborador,
                as: "formador_colab",
                attributes: ["nome"],
              }
            ]
          }

        ]
      });
      res.status(200).json(pedidos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar pedidos de curso" });
    }
  },

  // Obter um pedido_curso específico
  getPedidoCursoById: async (req, res) => {
    const { formador_id, curso_id } = req.params;
    try {
      const pedido = await models.pedido_curso.findOne({
        where: { formador_id, curso_id }
      });

      if (!pedido) {
        return res.status(404).json({ message: "Pedido_curso não encontrado" });
      }

      res.status(200).json(pedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar pedido_curso" });
    }
  },

  // Atualizar um pedido_curso
  updatePedidoCurso: async (req, res) => {
    const { formador_id, curso_id } = req.params;
    const { novo_formador_id, novo_curso_id } = req.body; // novos valores, se necessário

    try {
      const pedido = await models.pedido_curso.findOne({
        where: { formador_id, curso_id }
      });

      if (!pedido) {
        return res.status(404).json({ message: "Pedido_curso não encontrado" });
      }

      await pedido.update({
        formador_id: novo_formador_id ?? formador_id,
        curso_id: novo_curso_id ?? curso_id
      });

      res.status(200).json(pedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar pedido_curso" });
    }
  },

  // Remover um pedido_curso
  deletePedidoCurso: async (req, res) => {
    const { formador_id, curso_id } = req.params;

    try {
      const pedido = await models.pedido_curso.findOne({
        where: { formador_id, curso_id }
      });

      if (!pedido) {
        return res.status(404).json({ message: "Pedido_curso não encontrado" });
      }

      await pedido.destroy();
      res.status(200).json({ message: "Pedido_curso removido com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover pedido_curso" });
    }
  },
};

module.exports = controladorPedidos;
