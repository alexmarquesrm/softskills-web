const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const notificacaoController = {
  // Obter notificações de um formando
  getNotificacoesFormando: async (req, res) => {
    try {
      const { formandoId } = req.params;

      const notificacoes = await models.notificacao.findAll({
        where: { formando_id: formandoId },
        order: [['data_criacao', 'DESC']]
      });

      res.json(notificacoes);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      res.status(500).json({ error: 'Erro ao buscar notificações' });
    }
  },

  // Marcar uma notificação como lida
  marcarNotificacaoComoLida: async (req, res) => {
    try {
      const { notificacaoId } = req.params;

      const notificacao = await models.notificacao.findByPk(notificacaoId);
      
      if (!notificacao) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }

      await notificacao.update({ lida: true });
      res.json(notificacao);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      res.status(500).json({ error: 'Erro ao marcar notificação como lida' });
    }
  },

  // Marcar todas as notificações como lidas
  marcarTodasNotificacoesComoLidas: async (req, res) => {
    try {
      const formandoId = req.user.colaboradorid;

      await models.notificacao.update(
        { lida: true },
        { 
          where: { 
            formando_id: formandoId,
            lida: false
          }
        }
      );

      const notificacoes = await models.notificacao.findAll({
        where: { formando_id: formandoId }
      });

      res.json(notificacoes);
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      res.status(500).json({ error: 'Erro ao marcar todas notificações como lidas' });
    }
  }
};

module.exports = notificacaoController; 