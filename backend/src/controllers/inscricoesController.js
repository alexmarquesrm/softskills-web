const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorInscricoes = {
  async create(req, res) {
    try {
      const novaInscricao = await models.inscricao.create(req.body);
      res.status(201).json(novaInscricao);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao criar inscrição", detalhes: error.message });
    }
  },

  
  async getAll(req, res) {
    try {
      const inscricoes = await models.inscricao.findAll({
        include: [
          {
            model: models.curso,
            as: "inscricao_curso",
            include: [
                {
                    model: models.topico,
                    as: "curso_topico"
                }
            ]
          },
        ]
      });
      res.json(inscricoes);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao encontrar inscrições", detalhes: error.message });
    }
  },

  async getByFormandoId(req, res) {
    try {
      const formandoId = req.params.id;
  
      const inscricoes = await models.inscricao.findAll({
        where: { formando_id: formandoId },
        include: [
          {
            model: models.curso,
            as: "inscricao_curso",
            include: [
              {
                model: models.topico,
                as: "curso_topico"
              }
            ]
          },
          {
            model: models.formando,
            as: "inscricao_formando",
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
  
      if (inscricoes.length === 0) {
        return res.status(404).json({ erro: "Nenhuma inscrição encontrada para este formando" });
      }
  
      res.json(inscricoes);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar inscrições", detalhes: error.message });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const [atualizado] = await models.inscricao.update(req.body, {
        where: { inscricao_id: id }
      });
      if (atualizado === 0) {
        return res.status(404).json({ erro: "Inscrição não encontrada para atualização" });
      }
      res.json({ mensagem: "Inscrição atualizada com sucesso" });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar inscrição", detalhes: error.message });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      const deletado = await models.inscricao.destroy({
        where: { inscricao_id: id }
      });
      if (!deletado) {
        return res.status(404).json({ erro: "Inscrição não encontrada para exclusão" });
      }
      res.json({ mensagem: "Inscrição deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao deletar inscrição", detalhes: error.message });
    }
  }
};

module.exports = controladorInscricoes;
