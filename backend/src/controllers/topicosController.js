const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorTopicos = {
  // Criar novo tópico
  createTopico: async (req, res) => {
    const { area_id, descricao } = req.body;
    console.log("Dados recebidos:", req.body);
    try {
      const novoTopico = await models.topico.create({ area_id, descricao });
      res.status(201).json(novoTopico);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar tópico" });
    }
  },

  // Obter todos os tópicos
  getAllTopicos: async (req, res) => {
    try {
      const topicos = await models.topico.findAll();
      res.json(topicos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar tópicos" });
    }
  },

  // Obter um tópico por ID
  getTopicoById: async (req, res) => {
    const { id } = req.params;

    try {
      const topico = await models.topico.findByPk(id);
      if (!topico) {
        return res.status(404).json({ message: "Tópico não encontrado" });
      }
      res.json(topico);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar tópico" });
    }
  },

  // Atualizar um tópico
  updateTopico: async (req, res) => {
    const { id } = req.params;
    const { area_id, descricao } = req.body;
    console.log("Dados recebidos para atualização:", req.body);
    try {
      const topico = await models.topico.findByPk(id);
      if (!topico) {
        return res.status(404).json({ message: "Tópico não encontrado" });
      }

      await topico.update({ area_id, descricao });
      res.json({ message: "Tópico atualizado com sucesso", topico });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar tópico" });
    }
  },

  // Apagar um tópico
  deleteTopico: async (req, res) => {
    const { id } = req.params;

    try {
      const topico = await models.topico.findByPk(id);
      if (!topico) {
        return res.status(404).json({ message: "Tópico não encontrado" });
      }

      await topico.destroy();
      res.json({ message: "Tópico apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar tópico" });
    }
  },
};

module.exports = controladorTopicos;
