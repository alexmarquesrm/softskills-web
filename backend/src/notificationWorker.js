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
    console.log('Push enviado para token:', fcmToken);
  } catch (err) {
    console.error('Erro ao enviar push:', err);
  }
}

async function processarNotificacoesPendentes() {
  const notificacoes = await models.notificacao.findAll({
    where: { push_enviada: false }
  });

  for (const notificacao of notificacoes) {
    const colaborador = await models.colaborador.findByPk(notificacao.formando_id);
    if (colaborador && colaborador.fcmtoken) {
      await enviarPushParaUsuario(colaborador.fcmtoken, notificacao.titulo || 'Nova notificação', notificacao.mensagem || notificacao.descricao);
      notificacao.push_enviada = true;
      await notificacao.save();
    }
  }
}

function startWorker() {
  setInterval(processarNotificacoesPendentes, 10000); // a cada 10 segundos
  console.log('Worker de notificações iniciado...');
}

module.exports = { startWorker }; 