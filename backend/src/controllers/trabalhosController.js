const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorTrabalhos = {
  // Obter todos os trabalhos dos formandos
  getTrabalhosFormandos: async (req, res) => {
    try {
      const trabalhos = await models.trabalho.findAll({
        include: [
          {
            model: models.formando,
            as: "formando",
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

      // Transformar os dados para o formato desejado
      const formandosComTrabalhos = trabalhos.map(trab => ({
        formando_id: trab.formando_id,
        trabalho_id: trab.trabalho_id,
        nome: trab.formando.formando_colab.nome,
        avaliado: trab.nota !== null,
        nota: trab.nota,
        data_entrega: trab.data,
        descricao: trab.descricao
      }));

      res.json(formandosComTrabalhos);
    } catch (error) {
      console.error("Erro ao obter trabalhos dos formandos:", error);
      res.status(500).json({ message: "Erro interno ao obter trabalhos dos formandos" });
    }
  },

  // Avaliar um trabalho
  avaliarTrabalho: async (req, res) => {
    const { formando_id, trabalho_id, nota } = req.body;

    try {
      // Verificar se o trabalho existe e pertence ao formando
      const trabalho = await models.trabalho.findOne({
        where: { 
          trabalho_id,
          formando_id
        }
      });

      if (!trabalho) {
        return res.status(404).json({ message: "Trabalho não encontrado" });
      }

      // Atualizar a nota do trabalho
      await models.trabalho.update(
        { nota },
        { where: { trabalho_id } }
      );

      res.json({ message: "Trabalho avaliado com sucesso" });
    } catch (error) {
      console.error("Erro ao avaliar trabalho:", error);
      res.status(500).json({ message: "Erro interno ao avaliar trabalho" });
    }
  }
};

module.exports = controladorTrabalhos; 