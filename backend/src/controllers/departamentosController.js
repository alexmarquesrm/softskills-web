const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorDepartamentos = {
  // Criar novo departamento
  createDepartamento: async (req, res) => {
    const { descricao } = req.body;

    try {
      const novoDepartamento = await models.departamento.create({ descricao });
      res.status(201).json(novoDepartamento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar departamento" });
    }
  },

  // Obter todos os departamentos
  getAllDepartamentos: async (req, res) => {
    try {
      const departamentos = await models.departamento.findAll();
      res.json(departamentos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar departamentos" });
    }
  },

  // Obter um departamento por ID
  getDepartamentoById: async (req, res) => {
    const { id } = req.params;

    try {
      const departamento = await models.departamento.findByPk(id);
      if (!departamento) {
        return res.status(404).json({ message: "Departamento não encontrado" });
      }
      res.json(departamento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar departamento" });
    }
  },

  // Atualizar um departamento
  updateDepartamento: async (req, res) => {
    const { id } = req.params;
    const { descricao } = req.body;

    try {
      const departamento = await models.departamento.findByPk(id);
      if (!departamento) {
        return res.status(404).json({ message: "Departamento não encontrado" });
      }

      await departamento.update({ descricao });
      res.json({ message: "Departamento atualizado com sucesso", departamento });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar departamento" });
    }
  },

  // Apagar um departamento
  deleteDepartamento: async (req, res) => {
    const { id } = req.params;

    try {
      const departamento = await models.departamento.findByPk(id);
      if (!departamento) {
        return res.status(404).json({ message: "Departamento não encontrado" });
      }

      await departamento.destroy();
      res.json({ message: "Departamento apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar departamento" });
    }
  }
};

module.exports = controladorDepartamentos; 