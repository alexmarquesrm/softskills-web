const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const e = require("express");
const models = initModels(sequelizeConn);

const controladorFormandos = {
  getAllFormandos: async (req, res) => {
    try {
      const formandos = await models.formando.findAll({
        include: [
          {
            model: models.colaborador,
            as: "formando_colab",
            required: true,
            attributes: ["nome", "email", "telefone", "username"],
          },
        ],
        attributes: ["formando_id"],
      });

      res.json(formandos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao receber dados do formandos" });
    }
  },

  getCountFormandos: async (req, res) => {
    try {
      const totalformandos = await models.formando.count();
      res.status(200).json({ total: totalformandos});
    } catch (error) {
      console.error("Erro ao contar formandos:", error);
      res.status(500).json({ message: "Erro interno ao contar formandos" });
    }
  },

  getFormandoById: async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const formando = await models.formando.findOne({
        where: { formando_id: id },
        include: [
          {
            model: models.colaborador,
            as: "formando_colab",
            attributes: { exclude: ["pssword"] },
          },
        ],
        attributes: ["formando_id"],
      });

      if (!formando) {
        return res.status(404).json({ message: "Formando não encontrado" });
      }

      res.json(formando);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao receber dados do formando" });
    }
  },

  createFormando: async (req, res) => {
    const { colaborador_id } = req.body;

    try {
      // Verificar se o colaborador existe
      const colaborador = await models.colaborador.findByPk(colaborador_id);
      if (!colaborador) {
        return res.status(404).json({ message: "Colaborador não encontrado" });
      }

      // Obter credenciais do colaborador
      const credenciais = await models.credenciais.findOne({
        where: { colaborador_id }
      });

      if (!credenciais) {
        return res.status(404).json({ message: "Credenciais não encontradas para o colaborador" });
      }

      // Criar formando usando o ID da credencial
      const newFormando = await models.formando.create({
        formando_id: credenciais.credencial_id
      });

      res.status(201).json({
        message: "Formando criado com sucesso",
        formando_id: newFormando.formando_id
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar o formando" });
    }
  },

  updateFormando: async (req, res) => {
    const { id } = req.params;
    const { colaborador_id, login, password } = req.body;

    try {
      const formando = await models.formando.findOne({
        where: { formando_id: id },
      });

      if (!formando) {
        return res.status(404).json({ message: "Formando não encontrado" });
      }

      await models.credenciais.update(
        { colaborador_id, login, password },
        { where: { credencial_id: formando.formando_id } }
      );

      res.json({ message: "Formando atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar o formando" });
    }
  },

  deleteFormando: async (req, res) => {
    const { id } = req.params;

    try {
      const formando = await models.formando.findOne({
        where: { formando_id: id },
      });

      if (!formando) {
        return res.status(404).json({ message: "Formando não encontrado" });
      }

      // Apenas apagar o registo da tabela formando
      await models.formando.destroy({
        where: { formando_id: id },
      });

      res.json({ message: "Formando apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar o formando" });
    }
  },

};
module.exports = controladorFormandos;
