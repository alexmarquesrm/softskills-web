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

  async getById(req, res) {
    try {
      const id = req.params.id;
      const inscricao = await models.inscricao.findByPk(id);
      if (!inscricao) {
        return res.status(404).json({ erro: "Inscrição não encontrada" });
      }
      res.json(inscricao);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar inscrição", detalhes: error.message });
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
