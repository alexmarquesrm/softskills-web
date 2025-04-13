const initModels = require("../models/init-models");
const { generateToken } = require("../tokenUtils");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const bcrypt = require('bcrypt');

const controladorUtilizadores = {
  getAllColaboradores: async (req, res) => {
    try {
      const colaboradores = await models.colaborador.findAll({
        attributes: {
          exclude: ['pssword']
        }
      });
      res.json(colaboradores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao receber colaboradores" });
    }
  },

  getColaboradorById: async (req, res) => {
    const id = req.params.id;
    try {
      const colaborador = await models.colaborador.findByPk(id, {
        attributes: {
          exclude: ['pssword']
        }
      });
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

      let tipo = "Desconhecido";

      const [formando, formador, gestor] = await Promise.all([
        models.formando.findOne({ where: { formando_id: user.colaborador_id } }),
        models.formador.findOne({ where: { formador_id: user.colaborador_id } }),
        models.gestor.findOne({ where: { gestor_id: user.colaborador_id } })
      ]);

      if (formando) tipo = "Formando";
      else if (formador) tipo = "Formador";
      else if (gestor) tipo = "Gestor";

      const userData = {
        colaboradorid: user.colaborador_id,
        nome: user.nome,
        username: user.username,
        email: user.email,
        ultimologin: user.ultimologin,
        tipo
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

      res.status(200).json({ token: token });
    } catch (error) {
      res.status(500).json({ error: "Erro ao consultar utilizadores", details: error.message, });
    }
  },

  registarNovoColaborador: async (req, res) => {
    try {
      const { nome, email, data_nasc, cargo, departamento, telefone, score, sobre_mim, username, password } = req.body;

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
          :sobre_mim,
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
          sobre_mim,
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

  criarColaborador: async (req, res) => {
    try {
      const { nome, email, data_nasc, cargo, departamento, telefone, sobre_mim = null, score = 0, username, tipo, especialidade, inativo } = req.body;
      console.log(req.body);
      const hashedPassword = await bcrypt.hash("123", 10);

      console.log("Tipo de colaborador:", tipo === "Formador" ? "Formador" : "Formando");

      if (tipo === "Formando") {
        const sql = `
          SELECT criar_colaborador_default_formando( 
            :nome,
            :email,
            :data_nasc,
            :cargo,
            :departamento,
            :telefone,
            :sobre_mim,
            :score,
            :username,
            :hashedPassword
          )`;

        await sequelizeConn.query(sql, {
          replacements: { nome, email, data_nasc, cargo, departamento, telefone, sobre_mim, score, username, hashedPassword },
          type: sequelizeConn.QueryTypes.SELECT,
        });

        return res.status(201).json({ message: "Colaborador formando criado com sucesso." });

      } else if (tipo === "Formador") {
        const novoColaborador = await models.colaborador.create({
          nome,
          email,
          username,
          pssword: hashedPassword,
          data_nasc,
          cargo,
          departamento,
          telefone,
          sobre_mim,
          score: 0,
          inativo,
        });

        console.log("Novo colaborador:", novoColaborador);
        // Depois cria o formador com o ID do colaborador criado
        const novoFormador = await models.formador.create({
          formador_id: novoColaborador.colaborador_id,
          especialidade,
        });

        return res.status(201).json({
          message: "Formador criado com sucesso",
          formador: {
            id: novoFormador.formador_id,
            especialidade: novoFormador.especialidade,
          },
        });
      }

      return res.status(400).json({ message: "Tipo de colaborador inválido" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao criar colaborador" });
    }
  },

  updateColaborador: async (req, res) => {
    const id = req.params.id;
    try {
      const dadosAtualizados = { ...req.body };

      // Se vier uma nova password, fazer o hash
      if (dadosAtualizados.novaPassword) {
        const hashedPassword = await bcrypt.hash(dadosAtualizados.novaPassword, 10);
        dadosAtualizados.pssword = hashedPassword;
      }

      // Remover campos auxiliares que não existem na tabela
      delete dadosAtualizados.novaPassword;
      delete dadosAtualizados.confirmarPassword;

      const updated = await models.colaborador.update(dadosAtualizados, {
        where: { colaborador_id: id },
      });

      if (updated[0]) {
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
