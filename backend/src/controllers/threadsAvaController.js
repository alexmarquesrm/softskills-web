const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const { raw } = require("body-parser");
const { col } = require("sequelize");
const models = initModels(sequelizeConn);

const controladorThreadsAva = {
  // Criar uma nova avaliação para uma thread
  createThreadAvaliacao: async (req, res) => {
    const { thread_id, formando_id, vote } = req.body;

    try {
      const novaAvaliacao = await models.threads_avaliacao.create({
        thread_id,
        formando_id,
        vote,
      });
      res.status(201).json(novaAvaliacao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar a avaliação da thread" });
    }
  },

  // Obter todas as avaliações de threads
  getAllThreadAvaliacoes: async (req, res) => {
    try {
      const avaliacoes = await models.threads_avaliacao.findAll({
        include: [
          {
            model: models.threads,
            as: "thread",
          },
          {
            model: models.formando,
            as: "threads_avaliacao_formando",
            include: [
              {
                model: models.credenciais,
                as: "formando_credenciais",
              },
            ],
          },
        ],
      });
      
      const jsonParsed = await Promise.all(
        avaliacoes.map(async (avaliacao) => {
          const colaborador = await models.colaborador.findByPk(avaliacao.threads_avaliacao_formando.formando_credenciais.colaborador_id);
          console.log(colaborador);

          return {
            id: avaliacao.thread_id,
            formando_id: avaliacao.formando_id,
            vote: avaliacao.vote,
            thread: {
              id: avaliacao.thread.thread_id,
              titulo: avaliacao.thread.titulo,
              colaborador: {
                colaborador_id: colaborador.colaborador_id,
                nome: colaborador.nome,
                email: colaborador.email,
                telefone: colaborador.telefone,
              },
            },
          };
        })
      );

      if (!avaliacoes || avaliacoes.length === 0) {
        return res.status(200).json([]);
      }

      res.json(jsonParsed);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar avaliações" });
    }
  },

  // Obter avaliação de uma thread por thread_id e formando_id and count votes/sum
  getThreadAvaliacaoFormandoById: async (req, res) => {
    const { thread_id, formando_id } = req.params;

    try {
      const avaliacao = await models.threads_avaliacao.findOne({
        where: {
          thread_id,
          formando_id,
        },
      });

      if (!avaliacao) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }

      res.json(avaliacao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar avaliação da thread" });
    }
  },

  // Obter avaliação de uma thread por ID
  getThreadAvaliacaoById: async (req, res) => {
    const { thread_id } = req.params;

    try {
      const avaliacao = await models.threads_avaliacao.findOne({
        where: {
          thread_id,
        },
      });

      if (!avaliacao) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }

      res.json(avaliacao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar avaliação da thread" });
    }
  },

  // Atualizar avaliação de uma thread
  updateThreadAvaliacao: async (req, res) => {
    const { thread_id, formando_id } = req.params;
    const { vote } = req.body;

    try {
      const avaliacao = await models.threads_avaliacao.findOne({
        where: { thread_id, formando_id },
      });

      if (!avaliacao) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }

      await avaliacao.update({ vote });
      res.json({ message: "Avaliação atualizada com sucesso", avaliacao });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erro ao atualizar avaliação da thread" });
    }
  },

  // Deletar avaliação de uma thread
  deleteThreadAvaliacao: async (req, res) => {
    const { thread_id, formando_id } = req.params;

    try {
      const avaliacao = await models.threads_avaliacao.findOne({
        where: { thread_id, formando_id },
      });

      if (!avaliacao) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }

      await avaliacao.destroy();
      res.json({ message: "Avaliação apagada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar avaliação da thread" });
    }
  },
};
module.exports = controladorThreadsAva;
