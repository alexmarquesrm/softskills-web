const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const { get } = require("../routes/colaboradoresRoutes");
const models = initModels(sequelizeConn);

const controladorThreadsDen = {
  // Criar uma nova denúncia
  createDenuncia: async (req, res) => {
    try {
      const { thread_id, formando_id, descricao } = req.body;

      const thread = await models.threads.findByPk(thread_id);
      const formando = await models.formando.findByPk(formando_id);

      if (!thread) {
        return res.status(404).json({ message: "Thread não encontrada" });
      }
      if (!formando) {
        return res.status(404).json({ message: "Formando não encontrado" });
      }

      const novaDenuncia = await models.denuncias.create({
        thread_id,
        formando_id,
        descricao,
      });

      res.status(201).json(novaDenuncia);
    } catch (error) {
      console.error("Erro ao criar denúncia:", error);
      res.status(500).json({ message: "Erro interno ao criar denúncia" });
    }
  },

  // Obter todas as denúncias
  getAllDenuncias: async (req, res) => {
    try {
      const denuncias = await models.denuncias.findAll({
        include: [
          {
            model: models.threads,
            as: "den_thread",
          },
          {
            model: models.formando,
            as: "formando",
            include: [
              {
                model: models.colaborador,
                as: "formando_colab",
                attributes: ["nome"],
              },
            ],
          },
        ],
      });

      if (!denuncias || denuncias.length === 0) {
        return res.status(200).json([]);
      }

      res.json(denuncias);
    } catch (error) {
      console.error("Erro ao obter denúncias:", error);
      res.status(500).json({ message: "Erro interno ao obter denúncias" });
    }
  },

  getDenunciaById: async (req, res) => {
    try {
      const { denuncia_id } = req.params;

      const denuncia = await models.denuncias.findByPk(denuncia_id, {
        include: [
          {
            model: models.threads,
            as: "thread",
          },
          {
            model: models.formando,
            as: "formando",
            include: [
              {
                model: models.credenciais,
                as: "formando_credenciais",
                include: [
                  {
                    model: models.colaborador,
                    as: "credenciais_colaborador",
                  },
                ],
              },
            ],
          },
        ],
      });

      // Verifica se a denúncia existe
      if (!denuncia) {
        return res.status(404).json({ message: "Denúncia não encontrada" });
      }

      let colaborador = null;
      if (denuncia.formando?.formando_credenciais?.credenciais_colaborador) {
        colaborador = {
          colaborador_id: denuncia.formando.formando_credenciais.credenciais_colaborador.colaborador_id,
          nome: denuncia.formando.formando_credenciais.credenciais_colaborador.nome,
          email: denuncia.formando.formando_credenciais.credenciais_colaborador.email,
          telefone: denuncia.formando.formando_credenciais.credenciais_colaborador.telefone,
        };
      }

      const jsonParsed = {
        id: denuncia.denuncia_id,
        descricao: denuncia.descricao,
        thread: {
          id: denuncia.thread?.thread_id,
          titulo: denuncia.thread?.titulo,
          descricao: denuncia.thread?.descricao,
          colaborador: colaborador,
        },
      };

      res.json(jsonParsed);
    } catch (error) {
      console.error("Erro ao obter denúncia:", error);
      res.status(500).json({ message: "Erro interno ao obter denúncia" });
    }
  },

  deleteDenuncia: async (req, res) => {
    try {
      const { denuncia_id } = req.params;

      const denuncia = await models.denuncias.findByPk(denuncia_id);
      if (!denuncia) {
        return res.status(404).json({ message: "Denúncia não encontrada" });
      }

      await denuncia.destroy();
      res.status(200).json({ message: "Denúncia removida com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar denúncia:", error);
      res.status(500).json({ message: "Erro interno ao deletar denúncia" });
    }
  },
};

module.exports = controladorThreadsDen;
