const express = require("express");
const cors = require("cors");
const app = express();
const { authenticate } = require("./tokenUtils");
const colaboradorRoutes = require("./routes/colaboradoresRoutes");
const formandoRoutes = require("./routes/formandosRoutes");
const formadoresRoutes = require("./routes/formadoresRoutes");
const categoriasRoutes = require("./routes/categoriasRoutes");
const areasRoutes = require("./routes/areasRoutes");
const topicosRoutes = require("./routes/topicosRoutes");
const forumRoutes = require("./routes/forumRoutes");
const threadsRoutes = require("./routes/threadsRoutes");
const threadsAvaRoutes = require("./routes/threadsAvaRoutes");
const threadsDenRoutes = require("./routes/threadsDenRoutes");
const cursosRoutes = require("./routes/cursosRoutes");
const sincronosRoutes = require("./routes/sincronosRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");
const inscricoesRoutes = require("./routes/inscricoesRoutes");
const materiaisRoutes = require("./routes/materialsRoutes");
const comentariosRoutes = require("./routes/comentariosRoutes");
const notificacaoRoutes = require('./routes/notificacaoRoutes');
const avaliacaoFormadorRoutes = require('./routes/avaliacao_formador.routes');
const departamentosRoutes = require('./routes/departamentosRoutes');
const funcoesRoutes = require('./routes/funcoesRoutes');
const trabalhosRoutes = require('./routes/trabalhosRoutes');
const quizzRoutes = require('./routes/quizz');

// Importar os cron jobs
require('./cron/notificationCron');
//require('./cron/sincronoCron');
const { processFinishedCourses } = require('./cron/processFinishedCourses');

// Executar processamento de cursos terminados ao iniciar
processFinishedCourses();

// Use CORS middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use("/colaborador", colaboradorRoutes);
app.use("/formando", formandoRoutes);
app.use("/formador", formadoresRoutes);
app.use("/categoria", categoriasRoutes);
app.use("/area", authenticate, areasRoutes);
app.use("/topico", authenticate, topicosRoutes);
app.use("/forum", authenticate, forumRoutes);
app.use("/thread", authenticate, threadsRoutes);
app.use("/threadsAva", authenticate, threadsAvaRoutes);
app.use("/denuncia", authenticate, threadsDenRoutes);
app.use("/comentario", authenticate, comentariosRoutes);
app.use("/curso", cursosRoutes);
app.use("/sincrono", authenticate, sincronosRoutes);
app.use("/pedido", authenticate, pedidosRoutes);
app.use("/inscricao", authenticate, inscricoesRoutes);
app.use("/material", materiaisRoutes);
app.use('/notificacao', notificacaoRoutes);
app.use('/avaliacao-formador', avaliacaoFormadorRoutes);
app.use('/departamento', departamentosRoutes);
app.use('/funcao', funcoesRoutes);
app.use('/trabalhos', trabalhosRoutes);
app.use('/quizz', quizzRoutes);

// Rotas mobile
app.use("/mobile/notificacoes", require("./routes/mobileNotificacoesRoutes"));
app.use("/mobile/colaborador", require("./routes/mobileColaboradoresRoutes"));

app.listen(8000, () => {
  console.log("Servidor na porta 8000");
});

module.exports = app;