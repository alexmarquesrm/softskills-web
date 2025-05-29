const cron = require('node-cron');
const { Sequelize } = require('sequelize');
const sequelizeConn = require('../bdConexao');

// Função para processar cursos terminados
async function processFinishedCourses() {
  try {
    console.log('Executando verificação de cursos terminados...', new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }));
    
    // Executar a função do banco de dados para cursos síncronos
    const [resultSincrono] = await sequelizeConn.query('SELECT processar_cursos_sincronos_terminados()');
    
    console.log('Verificação concluída. Cursos síncronos processados:', resultSincrono[0].processar_cursos_sincronos_terminados);
  } catch (error) {
    console.error('Erro na verificação de cursos terminados:', error);
  }
}

// Executar todos os dias às 23:59 para processar cursos terminados
// cron.schedule('59 23 * * *', processFinishedCourses);

// Para testes, executar a cada 5 minutos
cron.schedule('*/5 * * * *', processFinishedCourses);

module.exports = { processFinishedCourses }; 