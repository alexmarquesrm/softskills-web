require('dotenv').config();
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const axios = require("axios");
const FCM_SERVER_KEY = "_Yoh_JfQ7Y1Xud13VEmQB11kWOpb1DqYdEbcXDWfab4"; // Get from environment variable
const { Op } = require("sequelize");

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

async function enviarPushParaUsuario(fcmToken, titulo, corpo) {
  if (!fcmToken) {
    console.log('FCM token não fornecido');
    return;
  }

  if (!FCM_SERVER_KEY) {
    console.error('FCM_SERVER_KEY não configurada no ambiente');
    return;
  }

  try {
    console.log('Enviando push notification para token:', fcmToken);
    console.log('Payload:', { titulo, corpo });
    
    // Usando o endpoint legacy do FCM
    const response = await axios.post('https://fcm.googleapis.com/fcm/send', {
      to: fcmToken,
      notification: {
        title: titulo,
        body: corpo
      }
    }, {
      headers: {
        'Authorization': `key=${FCM_SERVER_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Resposta do FCM:', response.data);
    return response.data;
  } catch (err) {
    console.error('Erro detalhado ao enviar push notification:', {
      message: err.message,
      response: err?.response?.data,
      status: err?.response?.status,
      headers: err?.response?.headers,
      config: {
        url: err?.config?.url,
        method: err?.config?.method,
        headers: err?.config?.headers
      }
    });
    throw err;
  }
}

// Função para enviar notificação de teste
async function enviarNotificacaoTeste(req, res) {
  try {
    const { fcmToken, titulo, corpo } = req.body;
    
    if (!fcmToken || !titulo || !corpo) {
      return res.status(400).json({ error: 'FCM token, título e corpo são obrigatórios' });
    }

    await enviarPushParaUsuario(fcmToken, titulo, corpo);
    res.json({ message: 'Notificação de teste enviada com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar notificação de teste:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação de teste' });
  }
}

// Função para enviar notificações push para notificações não lidas
async function enviarNotificacoesNaoLidas(formandoId) {
  try {
    const notificacoes = await models.notificacao.findAll({
      where: { 
        formando_id: formandoId,
        lida: false 
      },
      include: [{
        model: models.curso,
        as: 'curso',
        attributes: ['titulo']
      }]
    });

    const colaborador = await models.colaborador.findByPk(formandoId);
    if (!colaborador || !colaborador.fcmtoken) return;

    for (const notificacao of notificacoes) {
      await enviarPushParaUsuario(
        colaborador.fcmtoken,
        notificacao.curso?.titulo || 'Nova notificação',
        notificacao.mensagem
      );
    }
  } catch (error) {
    console.error('Erro ao enviar notificações não lidas:', error);
  }
}

// Função para enviar push quando uma nova notificação for criada
async function enviarPushNovaNotificacao(notificacao) {
  try {
    const colaborador = await models.colaborador.findByPk(notificacao.formando_id);
    if (!colaborador || !colaborador.fcmtoken) return;

    const curso = await models.curso.findByPk(notificacao.curso_id);
    
    await enviarPushParaUsuario(
      colaborador.fcmtoken,
      curso?.titulo || 'Nova notificação',
      notificacao.mensagem
    );
  } catch (error) {
    console.error('Erro ao enviar push para nova notificação:', error);
  }
}

module.exports = {
  ...notificacaoController,
  enviarNotificacaoTeste,
  enviarPushParaUsuario
}; 