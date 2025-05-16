const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const { Op } = require("sequelize");
const models = initModels(sequelizeConn);

const controladorComentarios = {
  // Função auxiliar para procurar respostas recursivamente
  async procurarRespostas(comentarioId) {
    // procurar as respostas deste comentário
    const respostasIds = await models.comentario_resposta.findAll({
      where: { comentariopai_id: comentarioId },
      attributes: ['resposta_id']
    });

    if (respostasIds.length === 0) {
      return [];
    }

    // procurar os comentários que são respostas
    const respostas = await models.comentarios.findAll({
      where: {
        comentario_id: respostasIds.map(r => r.resposta_id)
      },
      include: [{
        model: models.colaborador,
        as: 'colab_comentarios',
        attributes: ['nome', 'cargo', 'departamento']
      }],
      order: [['comentario_id', 'ASC']]
    });

    // Para cada resposta, procurar suas próprias respostas
    const respostasComRespostas = await Promise.all(respostas.map(async (resposta) => {
      const respostaJSON = resposta.toJSON();
      respostaJSON.respostas = await controladorComentarios.procurarRespostas(resposta.comentario_id);
      return respostaJSON;
    }));

    return respostasComRespostas;
  },

  // Criar um novo comentário
  async createComentario(req, res) {
    try {
      const { thread_id, colaborador_id, descricao, comentariopai_id } = req.body;

      // Verificar se a thread existe
      const thread = await models.threads.findByPk(thread_id);
      if (!thread) {
        return res.status(404).json({ error: 'Thread não encontrada' });
      }

      // Verificar se o colaborador existe
      const colaborador = await models.colaborador.findByPk(colaborador_id);
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' });
      }

      // Criar o comentário
      const novoComentario = await models.comentarios.create({
        thread_id,
        colaborador_id,
        descricao
      });

      // Se for uma resposta, criar a relação
      if (comentariopai_id) {
        await models.comentario_resposta.create({
          resposta_id: novoComentario.comentario_id,
          comentariopai_id
        });
      }

      // procurar o comentário criado com as informações do colaborador
      const comentarioCompleto = await models.comentarios.findByPk(novoComentario.comentario_id, {
        include: [{
          model: models.colaborador,
          as: 'colab_comentarios',
          attributes: ['nome', 'cargo', 'departamento']
        }]
      });

      res.status(201).json(comentarioCompleto);
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      res.status(500).json({ error: 'Erro ao criar comentário' });
    }
  },

  // procurar comentários de uma thread
  async getComentariosByThread(req, res) {
    try {
      const { thread_id } = req.params;
      console.log('A procurar comentários para thread:', thread_id);

      // Verificar se a thread existe
      const thread = await models.threads.findByPk(thread_id);
      if (!thread) {
        return res.status(404).json({ error: 'Thread não encontrada' });
      }

      // procurar IDs dos comentários que são respostas
      const comentariosResposta = await models.comentario_resposta.findAll({
        attributes: ['resposta_id']
      });
      const idsRespostas = comentariosResposta.map(cr => cr.resposta_id);

      // procurar comentários principais (não são respostas)
      const comentarios = await models.comentarios.findAll({
        where: { 
          thread_id,
          comentario_id: {
            [Op.notIn]: idsRespostas
          }
        },
        include: [
          {
            model: models.colaborador,
            as: 'colab_comentarios',
            attributes: ['nome', 'cargo', 'departamento']
          }
        ],
        order: [['comentario_id', 'DESC']]
      });

      // Para cada comentário, procurar suas respostas recursivamente
      const comentariosComRespostas = await Promise.all(comentarios.map(async (comentario) => {
        const comentarioJSON = comentario.toJSON();
        comentarioJSON.respostas = await controladorComentarios.procurarRespostas(comentario.comentario_id);
        return comentarioJSON;
      }));

      console.log('Comentários com respostas:', comentariosComRespostas.length);
      res.json(comentariosComRespostas);
    } catch (error) {
      console.error('Erro ao procurar comentários:', error);
      res.status(500).json({ error: 'Erro ao procurar comentários', details: error.message });
    }
  },

  // Atualizar um comentário
  async updateComentario(req, res) {
    try {
      const { id } = req.params;
      const { descricao } = req.body;

      const comentario = await models.comentarios.findByPk(id);
      if (!comentario) {
        return res.status(404).json({ error: 'Comentário não encontrado' });
      }

      await comentario.update({ descricao });

      // procurar o comentário atualizado com as informações do colaborador
      const comentarioAtualizado = await models.comentarios.findByPk(id, {
        include: [{
          model: models.colaborador,
          as: 'colab_comentarios',
          attributes: ['nome', 'cargo', 'departamento']
        }]
      });

      res.json(comentarioAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
  },

  // Deletar um comentário
  async deleteComentario(req, res) {
    try {
      const { id } = req.params;

      const comentario = await models.comentarios.findByPk(id);
      if (!comentario) {
        return res.status(404).json({ error: 'Comentário não encontrado' });
      }

      // Deletar todas as respostas primeiro
      await models.comentario_resposta.destroy({
        where: {
          [Op.or]: [
            { resposta_id: id },
            { comentariopai_id: id }
          ]
        }
      });

      // Deletar o comentário principal
      await comentario.destroy();

      res.json({ message: 'Comentário e suas respostas foram deletados com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
  }
};

module.exports = controladorComentarios; 