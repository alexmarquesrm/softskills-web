const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const mobileColaboradoresController = {
  // Registrar/atualizar token FCM
  registrarFcmToken: async (req, res) => {
    try {
      const { colaboradorid, fcmToken } = req.body;
      if (!colaboradorid || !fcmToken) {
        return res.status(400).json({ message: "Dados insuficientes" });
      }
      await models.colaborador.update(
        { fcmtoken: fcmToken },
        { where: { colaborador_id: colaboradorid } }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao registrar FCM token" });
    }
  },

  // Buscar perfil simplificado
  getPerfil: async (req, res) => {
    try {
      const colaboradorid = req.user?.colaboradorid || req.body.colaboradorid;
      if (!colaboradorid) return res.status(400).json({ message: "ID do colaborador não informado" });
      const colaborador = await models.colaborador.findByPk(colaboradorid, {
        attributes: { exclude: ["pssword"] }
      });
      if (!colaborador) {
        return res.status(404).json({ message: "Colaborador não encontrado" });
      }
      res.json(colaborador);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  }
};

module.exports = mobileColaboradoresController; 