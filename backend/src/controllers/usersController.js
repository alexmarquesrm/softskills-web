const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorUtilizadores = {
  getAllColaboradores: async (req, res) => {
    try {
      const colaboradores = await models.colaborador.findAll();
      res.json(colaboradores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao receber colaboradores" });
    }
  },

  getColaboradorById: async (req, res) => {
    const id = req.params.id;
    try {
      const colaborador = await models.colaborador.findByPk(id);
      if (!colaborador) {
        return res.status(404).json({ message: "Colaborador não encontrado" });
      }
      res.json(colaborador);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao obter colaborador" });
    }
  },

  createColaborador: async (req, res) => {
    try {
      const { nome, email, idade, cargo, departamento, telefone } = req.body;
      const colaborador = await models.colaborador.create({
        nome,
        email,
        idade,
        cargo,
        departamento,
        telefone,
      });
      res.status(201).json({ message: "Utilizador adicionado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar colaborador" });
    }
  },

  updateColaborador: async (req, res) => {
    const id = req.params.id;
    try {
      const updated = await models.colaborador.update(req.body, {
        where: { colaborador_id: id },
      });
      if (updated) {
        const updatedColaborador = await models.colaborador.findByPk(id);
        return res.json(updatedColaborador);
      }
      res.status(404).json({ message: "Colaborador não encontrado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar colaborador" });
    }
  },
};
module.exports = controladorUtilizadores;
