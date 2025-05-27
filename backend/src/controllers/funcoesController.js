const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorFuncoes = {
  // Criar nova função
  createFuncao: async (req, res) => {
    const { descricao } = req.body;

    try {
      const novaFuncao = await models.funcao.create({ descricao });
      res.status(201).json(novaFuncao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar função" });
    }
  },

  // Obter todas as funções
  getAllFuncoes: async (req, res) => {
    try {
      const funcoes = await models.funcao.findAll();
      res.json(funcoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar funções" });
    }
  },

  // Obter uma função por ID
  getFuncaoById: async (req, res) => {
    const { id } = req.params;

    try {
      const funcao = await models.funcao.findByPk(id);
      if (!funcao) {
        return res.status(404).json({ message: "Função não encontrada" });
      }
      res.json(funcao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar função" });
    }
  },

  // Atualizar uma função
  updateFuncao: async (req, res) => {
    const { id } = req.params;
    const { descricao } = req.body;

    try {
      const funcao = await models.funcao.findByPk(id);
      if (!funcao) {
        return res.status(404).json({ message: "Função não encontrada" });
      }

      await funcao.update({ descricao });
      res.json({ message: "Função atualizada com sucesso", funcao });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar função" });
    }
  },

  // Apagar uma função
  deleteFuncao: async (req, res) => {
    const { id } = req.params;

    try {
      const funcao = await models.funcao.findByPk(id);
      if (!funcao) {
        return res.status(404).json({ message: "Função não encontrada" });
      }

      await funcao.destroy();
      res.json({ message: "Função apagada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar função" });
    }
  }
};

module.exports = controladorFuncoes; 