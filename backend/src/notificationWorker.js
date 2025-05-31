const initModels = require("./models/init-models");
const sequelizeConn = require("./bdConexao");
const models = initModels(sequelizeConn);
const admin = require('firebase-admin');
const path = require('path');

// Inicializa o Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, '../firebase-service-account.json'));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function enviarPushParaUsuario(fcmToken, titulo, corpo) {
  if (!fcmToken) return;
  try {
    const message = {
      token: fcmToken,
      notification: { title: titulo, body: corpo }
    };
    await admin.messaging().send(message);
  } catch (err) {
    // Silencioso
  }
}

async function processarNotificacoesPendentes() {
  const notificacoes = await models.notificacao.findAll({
    where: { enviada: false }
  });

  for (const notificacao of notificacoes) {
    const colaborador = await models.colaborador.findByPk(notificacao.formando_id);
    if (colaborador && colaborador.fcmtoken) {
      await enviarPushParaUsuario(colaborador.fcmtoken, notificacao.titulo || 'Nova notificação', notificacao.mensagem || notificacao.descricao);
      notificacao.enviada = true;
      await notificacao.save();
    }
  }
}

function startWorker() {
  setInterval(processarNotificacoesPendentes, 10000); // a cada 10 segundos
}

module.exports = { startWorker }; 