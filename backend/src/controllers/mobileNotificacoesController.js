const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const { enviarPushParaUsuario } = require("./notificacaoController");

const mobileNotificacoesController = {
  // Buscar notificações do usuário (mobile)
  getNotificacoes: async (req, res) => {
    try {
      const colaboradorid = req.user?.colaboradorid || req.body.colaboradorid;
      if (!colaboradorid) return res.status(400).json({ error: "ID do colaborador não informado" });
      const notificacoes = await models.notificacao.findAll({
        where: { formando_id: colaboradorid },
        order: [["data_criacao", "DESC"]],
        limit: 50
      });
      res.json(notificacoes);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar notificações" });
    }
  },

  // Enviar push de teste (mobile)
  testePush: async (req, res) => {
    try {
      console.log('Iniciando teste de push notification...');
      const { colaboradorid, titulo, corpo } = req.body;
      console.log('Dados recebidos:', { colaboradorid, titulo, corpo });

      if (!colaboradorid || !titulo || !corpo) {
        console.log('Dados insuficientes:', { colaboradorid, titulo, corpo });
        return res.status(400).json({ error: "Dados insuficientes" });
      }

      console.log('Buscando colaborador com ID:', colaboradorid);
      const colaborador = await models.colaborador.findByPk(colaboradorid);
      
      if (!colaborador) {
        console.log('Colaborador não encontrado');
        return res.status(404).json({ error: "Colaborador não encontrado" });
      }

      console.log('FCM Token do colaborador:', colaborador.fcmtoken);
      
      if (!colaborador.fcmtoken) {
        console.log('Token FCM não encontrado para o colaborador');
        return res.status(404).json({ error: "Token não encontrado" });
      }

      console.log('Enviando push notification...');
      const fcmResponse = await enviarPushParaUsuario(colaborador.fcmtoken, titulo, corpo);
      console.log('Resposta do FCM:', fcmResponse);
      
      res.json({ 
        success: true,
        fcmResponse
      });
    } catch (error) {
      console.error('Erro detalhado ao enviar push:', {
        message: error.message,
        stack: error.stack,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      // Verificar se é um erro específico do FCM
      if (error?.response?.data?.error) {
        return res.status(400).json({ 
          error: "Erro no FCM",
          details: error.response.data.error
        });
      }
      
      res.status(500).json({ 
        error: error?.response?.data || error.message || String(error),
        details: error?.stack
      });
    }
  }
};

module.exports = mobileNotificacoesController; 