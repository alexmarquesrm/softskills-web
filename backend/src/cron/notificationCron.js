const cron = require('node-cron');
const { Sequelize } = require('sequelize');
const sequelizeConn = require('../bdConexao');

// Executar todos os dias à meia-noite
// cron.schedule('0 0 * * *', async () => {
//   try {
//     console.log('Executando processamento de notificações de início de curso...', new Date().toLocaleString());
    
//     // Executar a função do banco de dados
//     const [result] = await sequelizeConn.query('SELECT processar_notificacoes_inicio_curso()');
    
//     console.log('Processamento de notificações concluído. Notificações criadas:', result[0].processar_notificacoes_inicio_curso);
//   } catch (error) {
//     console.error('Erro ao processar notificações:', error);
//   }
// });

// Para testes, executar a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Executando verificação de notificações...', new Date().toLocaleString());
    
    // Executar a função do banco de dados
    const [result] = await sequelizeConn.query('SELECT processar_notificacoes_inicio_curso()');
    
    console.log('Verificação concluída. Notificações criadas:', result[0].processar_notificacoes_inicio_curso);
  } catch (error) {
    console.error('Erro na verificação de notificações:', error);
  }
}); 