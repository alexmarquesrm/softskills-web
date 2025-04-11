const initModels = require("../models/init-models");
const { generateToken } = require("../tokenUtils");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const bcrypt = require('bcrypt');

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

  getUserByLogin: async (req, res) => {
    const username = req.params.username;
    try {
      const user = await models.colaborador.findOne({
        where: { username: username },
      });

      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }
      res.json(user);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao encontrar utilizador" });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const user = await models.colaborador.findOne({
        where: { username }
      });

      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }

      const passwordMatch = await bcrypt.compare(password, user.pssword);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Password incorreta" });
      }

      const userData = {
        colaboradorid: user.colaborador_id,
        nome: user.nome,
        username: user.username,
        ultimologin: user.ultimologin,
      };

      res.status(200).json({ user: userData });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no login" });
    }
  },

  novoToken: async (req, res) => {
    const { id } = req.params;
    try {
      const colaborador = await models.colaborador.findByPk(id);
      
      const token = generateToken(colaborador);

      // await models.colaborador.update(
      //   {
      //     ultimologin: Sequelize.literal("CURRENT_TIMESTAMP"),
      //   },
      //   {
      //     where: {
      //       utilizadorid: id,
      //     },
      //   }
      // );

      // const saudacao = await sequelizeConn.query(`SELECT ObterSaudacao(${id})`);

      res.status(200).json({ token: token});
    } catch (error) {
      res.status(500).json({ error: "Erro ao consultar utilizadores", details: error.message, });
    }
  },

  createColaborador: async (req, res) => {
    try {
      const {
        nome,
        email,
        data_nasc,
        cargo,
        departamento,
        telefone,
        score,
        username,
        password
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
        SELECT criar_colaborador_default_formando(
          :nome,
          :email,
          :data_nasc,
          :cargo,
          :departamento,
          :telefone,
          :score,
          :username,
          :hashedPassword
        )
      `;

      await sequelizeConn.query(sql, {
        replacements: {
          nome,
          email,
          data_nasc,
          cargo,
          departamento,
          telefone,
          score,
          username,
          hashedPassword
        },
        type: sequelizeConn.QueryTypes.SELECT
      });

      res.status(201).json({ message: "Colaborador e formando default criados com sucesso." });

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
