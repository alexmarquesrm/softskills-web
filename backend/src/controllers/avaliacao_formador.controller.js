const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorAvaliacaoFormador = {
  // Criar uma nova avaliação
  createAvaliacao: async (req, res) => {
    const { curso_id, formador_id, formando_id, avaliacao } = req.body;

    try {
      // Verificar se o formando já avaliou este formador neste curso
      const avaliacaoExistente = await models.avaliacao_formador.findOne({
        where: {
          curso_id,
          formador_id,
          formando_id
        }
      });

      if (avaliacaoExistente) {
        return res.status(400).json({ 
          message: "Este formando já avaliou este formador neste curso" 
        });
      }

      const novaAvaliacao = await models.avaliacao_formador.create({
        curso_id,
        formador_id,
        formando_id,
        avaliacao,
        data_avaliacao: new Date()
      });
      res.status(201).json(novaAvaliacao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar avaliação" });
    }
  },

  // Recuperar todas as avaliações
  getAllAvaliacoes: async (req, res) => {
    const curso_id = req.query.curso_id;
    const formador_id = req.query.formador_id;
    const formando_id = req.query.formando_id;
    var condition = {};

    if (curso_id) {
      condition.curso_id = curso_id;
    }
    if (formador_id) {
      condition.formador_id = formador_id;
    }
    if (formando_id) {
      condition.formando_id = formando_id;
    }

    try {
      const avaliacoes = await models.avaliacao_formador.findAll({
        where: condition,
        include: [
          {
            model: models.curso,
            as: "avaformador_curso"
          },
          {
            model: models.formador,
            as: "avaformador_formador"
          },
          {
            model: models.formando,
            as: "avaformador_formando",
            include: [
              {
                model: models.colaborador,
                as: "formando_colab",
                attributes: ["nome", "email"]
              }
            ]
          }
        ]
      });
      res.json(avaliacoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao recuperar avaliações" });
    }
  },

  // Encontrar uma avaliação pelo id
  getAvaliacaoById: async (req, res) => {
    const { id } = req.params;

    try {
      const avaliacao = await models.avaliacao_formador.findByPk(id, {
        include: [
          {
            model: models.curso,
            as: "avaformador_curso"
          },
          {
            model: models.formador,
            as: "avaformador_formador"
          }
        ]
      });

      if (!avaliacao) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }

      res.json(avaliacao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao recuperar avaliação" });
    }
  },

  // Atualizar uma avaliação
  updateAvaliacao: async (req, res) => {
    const { id } = req.params;
    const { avaliacao } = req.body;

    try {
      const avaliacaoExistente = await models.avaliacao_formador.findByPk(id);
      if (!avaliacaoExistente) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }

      await avaliacaoExistente.update({ avaliacao });
      res.json({ message: "Avaliação atualizada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar avaliação" });
    }
  },

  // Deletar uma avaliação
  deleteAvaliacao: async (req, res) => {
    const { id } = req.params;

    try {
      const avaliacao = await models.avaliacao_formador.findByPk(id);
      if (!avaliacao) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }

      await avaliacao.destroy();
      res.json({ message: "Avaliação deletada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar avaliação" });
    }
  },

  // Deletar todas as avaliações
  deleteAllAvaliacoes: async (req, res) => {
    try {
      const deleted = await models.avaliacao_formador.destroy({
        where: {},
        truncate: false
      });
      res.json({ message: `${deleted} Avaliações foram deletadas com sucesso!` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar avaliações" });
    }
  },

  // procurar todas as avaliações de um formador específico
  getAvaliacoesByFormador: async (req, res) => {
    const { formador_id } = req.params;

    try {
      const avaliacoes = await models.avaliacao_formador.findAll({
        where: { formador_id },
        include: [
          {
            model: models.curso,
            as: "avaformador_curso",
            attributes: ['curso_id', 'titulo', 'descricao']
          }
        ],
        attributes: ['avaliacao_id', 'avaliacao', 'data_avaliacao']
      });
      
      if (!avaliacoes || avaliacoes.length === 0) {
        return res.status(404).json({ message: "Nenhuma avaliação encontrada para este formador" });
      }

      // Calcular média das avaliações
      const media = avaliacoes.reduce((acc, curr) => acc + curr.avaliacao, 0) / avaliacoes.length;

      res.json({
        formador_id,
        total_avaliacoes: avaliacoes.length,
        media_avaliacoes: media.toFixed(1),
        avaliacoes
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao recuperar avaliações do formador" });
    }
  }
};

module.exports = controladorAvaliacaoFormador; 