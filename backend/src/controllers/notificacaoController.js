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
        include: [{
          model: models.curso,
          as: 'curso',
          attributes: ['titulo', 'descricao']
        }],
        order: [['data_criacao', 'DESC']]
      });

      res.json(notificacoes);
    } catch (error) {
      console.error('Erro ao procurar notificações:', error);
      res.status(500).json({ error: 'Erro ao procurar notificações' });
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
      const { colaboradorid } = req.body;
      
      if (!colaboradorid) {
        return res.status(400).json({ error: 'ID do formando não fornecido' });
      }

      await models.notificacao.update(
        { lida: true },
        { 
          where: { 
            formando_id: colaboradorid,
            lida: false
          }
        }
      );

      const notificacoes = await models.notificacao.findAll({
        where: { formando_id: colaboradorid },
        include: [{
          model: models.curso,
          as: 'curso',
          attributes: ['titulo', 'descricao']
        }]
      });

      res.json(notificacoes);
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      res.status(500).json({ error: 'Erro ao marcar todas notificações como lidas' });
    }
  },

  // Processar notificações de início de curso (para ser chamado por um cron job)
  processarNotificacoesInicioCurso: async (req, res) => {
    try {
      const result = await sequelizeConn.query('SELECT processar_notificacoes_inicio_curso()');
      res.json({ message: 'Notificações processadas com sucesso', result: result[0][0] });
    } catch (error) {
      console.error('Erro ao processar notificações de início de curso:', error);
      res.status(500).json({ error: 'Erro ao processar notificações de início de curso' });
    }
  }
};

module.exports = notificacaoController; 