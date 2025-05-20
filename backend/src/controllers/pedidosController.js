const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const { Op } = Sequelize;

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
          },
          {
            model: models.curso,
            as: "ped_curso",
            attributes: ["titulo", "pendente"],
            required: false,
            where: {
              curso_id: {
                [Op.col]: 'pedidos.referencia_id'
              }
            },
            on: {
              [Op.and]: [
                Sequelize.where(Sequelize.col('pedidos.tipo'), 'CURSO')
              ]
            }
          },
          {
            model: models.forum,
            as: "ped_forum",
            attributes: ["descricao", "pendente"],
            required: false,
            where: {
              forum_id: {
                [Op.col]: 'pedidos.referencia_id'
              }
            },
            on: {
              [Op.and]: [
                Sequelize.where(Sequelize.col('pedidos.tipo'), 'FORUM')
              ]
            }
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
      const includes = [
        {
          model: models.colaborador,
          as: "ped_colaborador",
          attributes: ["nome"]
        }
      ];

      // Add curso or forum based on tipo
      if (tipo === 'CURSO') {
        includes.push({
          model: models.curso,
          as: "ped_curso",
          attributes: ["titulo", "pendente"],
          required: false,
          where: {
            curso_id: {
              [Op.col]: 'pedidos.referencia_id'
            }
          }
        });
      } else if (tipo === 'FORUM') {
        includes.push({
          model: models.forum,
          as: "ped_forum",
          attributes: ["descricao", "pendente"],
          required: false,
          where: {
            forum_id: {
              [Op.col]: 'pedidos.referencia_id'
            }
          }
        });
      }

      const pedidos = await models.pedidos.findAll({
        where: { tipo },
        include: includes
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
          },
          {
            model: models.curso,
            as: "ped_curso",
            attributes: ["titulo", "pendente"],
            required: false,
            where: {
              curso_id: {
                [Op.col]: 'pedidos.referencia_id'
              }
            },
            on: {
              [Op.and]: [
                Sequelize.where(Sequelize.col('pedidos.tipo'), 'CURSO')
              ]
            }
          },
          {
            model: models.forum,
            as: "ped_forum",
            attributes: ["descricao", "pendente"],
            required: false,
            where: {
              forum_id: {
                [Op.col]: 'pedidos.referencia_id'
              }
            },
            on: {
              [Op.and]: [
                Sequelize.where(Sequelize.col('pedidos.tipo'), 'FORUM')
              ]
            }
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

  updatePedido: async (req, res) => {
    const { pedido_id } = req.params;
    const { tipo, referencia_id, pendente, status, aprovado } = req.body;

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

      //  (curso ou fórum)
      if (typeof pendente !== 'undefined' || status) {
        if (pedido.tipo === "CURSO") {
          const curso = await models.curso.findOne({
            where: { curso_id: pedido.referencia_id }
          });

          if (curso) {
            await curso.update({
              aprovado: aprovado,
              pendente: typeof pendente !== 'undefined' ? pendente : curso.pendente,
              status: status ?? curso.status
            });
          }
        } else if (pedido.tipo === "FORUM") {
          const forum = await models.forum.findOne({
            where: { forum_id: pedido.referencia_id }
          });

          if (forum) {
            await forum.update({
              aprovado: aprovado,
              pendente: typeof pendente !== 'undefined' ? pendente : forum.pendente,
              status: status ?? forum.status
            });
          }
        }
      }

      res.status(200).json({ message: "Pedido atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      res.status(500).json({ message: "Erro ao atualizar o pedido" });
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
