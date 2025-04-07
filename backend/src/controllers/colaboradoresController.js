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
      const {
        nome,
        email,
        idade,
        cargo,
        departamento,
        telefone,
        score,
        login,
        password
      } = req.body;
  
      const sql = `
        SELECT criar_colaborador_default_formando(
          :nome,
          :email,
          :idade,
          :cargo,
          :departamento,
          :telefone,
          :score,
          :login,
          :password
        )
      `;
  
      await sequelizeConn.query(sql, {
        replacements: {
          nome,
          email,
          idade,
          cargo,
          departamento,
          telefone,
          score,
          login,
          password
        },
        type: sequelizeConn.QueryTypes.SELECT
      });
  
      res.status(201).json({ message: "Colaborador, credenciais e formando criados com sucesso." });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar colaborador." });
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

  deleteColaborador: async (req, res) => {
    const id = req.params.id;
    try {
      const deleted = await models.colaborador.destroy({
        where: { colaborador_id: id },
      });
      if (deleted) {
        return res.json({ message: "Colaborador removido com sucesso" });
      }
      res.status(404).json({ message: "Colaborador não encontrado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover colaborador" });
    }
  },
};
module.exports = controladorUtilizadores;
