const cron = require('node-cron');
const { Sequelize } = require('sequelize');
const sequelizeConn = require('../bdConexao');

// Executar todos os dias às 23:59 para atualizar estados dos cursos síncronos
// cron.schedule('59 23 * * *', async () => {
//   try {
//     console.log('Executando atualização de estados dos cursos síncronos...', new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }));
    
//     // Executar a função do banco de dados
//     const [result] = await sequelizeConn.query('SELECT verificar_e_atualizar_estados_sincrono()');
    
//     console.log('Atualização de estados concluída. Cursos atualizados:', result[0].verificar_e_atualizar_estados_sincrono);
//   } catch (error) {
//     console.error('Erro ao atualizar estados dos cursos síncronos:', error);
//   }
// });

// Para testes, executar a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Executando verificação de estados dos cursos síncronos...', new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }));
    
    // Executar a função do banco de dados
    const [result] = await sequelizeConn.query('SELECT verificar_e_atualizar_estados_sincrono()');
    
    console.log('Verificação concluída. Cursos atualizados:', result[0].verificar_e_atualizar_estados_sincrono);
  } catch (error) {
    console.error('Erro na verificação de estados:', error);
  }
});

module.exports = {}; 