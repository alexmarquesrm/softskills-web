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

  // Marcar notificação como lida
  marcarComoLida: async (req, res) => {
    try {
      const { notificacaoId } = req.body;
      if (!notificacaoId) return res.status(400).json({ error: "ID da notificação não informado" });
      await models.notificacao.update(
        { lida: true },
        { where: { notificacao_id: notificacaoId } }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao marcar como lida" });
    }
  },

  // Enviar push de teste (apenas mobile)
  testePush: async (req, res) => {
    try {
      const { colaboradorid, titulo, corpo } = req.body;
      if (!colaboradorid || !titulo || !corpo) return res.status(400).json({ error: "Dados insuficientes" });
      const colaborador = await models.colaborador.findByPk(colaboradorid);
      if (!colaborador || !colaborador.fcmtoken) {
        return res.status(404).json({ error: "Token não encontrado" });
      }
      await enviarPushParaUsuario(colaborador.fcmtoken, titulo, corpo);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao enviar push" });
    }
  }
};

module.exports = mobileNotificacoesController; 