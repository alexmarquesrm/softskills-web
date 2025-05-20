const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const { Sequelize } = require("sequelize");

const controladorForuns = {
// Criar novo fórum
createForum: async (req, res) => {
    const { topico_id, descricao } = req.body;
    try {
      const novoForum = await models.forum.create({ topico_id, descricao });
      res.status(201).json(novoForum);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar fórum" });
    }
  },

  // Obter todos os fóruns
  getAllForums: async (req, res) => {
    try {
      const forums = await models.forum.findAll({
        include: [
          {
            model: models.topico,
            as: 'forum_topico',
            include: [
              {
                model: models.area,
                as: 'topico_area'
              }
            ]
          }
        ],
        where: {
          pendente: false
        }
      });

      if (!forums || forums.length === 0) {
        return res.status(200).json([]);
      }

      // Transform the data structure
      const result = forums.map(forum => {
        const forumJSON = forum.toJSON();
        
        // Ensure counts are numbers
        forumJSON.thread_count = 0;
        forumJSON.participant_count = 0;

        return forumJSON;
      });

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar fóruns" });
    }
  },

  // Obter um fórum por ID
  getForumById: async (req, res) => {
    const { id } = req.params;

    try {
      const forum = await models.forum.findByPk(id);
      if (!forum) {
        return res.status(404).json({ message: "Fórum não encontrado" });
      }
      res.json(forum);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar fórum" });
    }
  },

  // Atualizar um fórum
  updateForum: async (req, res) => {
    const { id } = req.params;
    const { topico_id, descricao } = req.body;

    try {
      const forum = await models.forum.findByPk(id);
      if (!forum) {
        return res.status(404).json({ message: "Fórum não encontrado" });
      }

      await forum.update({ topico_id, descricao });
      res.json({ message: "Fórum atualizado com sucesso", forum });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar fórum" });
    }
  },

  // Apagar um fórum
  deleteForum: async (req, res) => {
    const { id } = req.params;

    try {
      const forum = await models.forum.findByPk(id);
      if (!forum) {
        return res.status(404).json({ message: "Fórum não encontrado" });
      }

      await forum.destroy();
      res.json({ message: "Fórum apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar fórum" });
    }
  },
};

module.exports = controladorForuns;
