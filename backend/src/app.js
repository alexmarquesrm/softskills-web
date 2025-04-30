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
app.use("/curso", cursosRoutes);
app.use("/sincrono", authenticate, sincronosRoutes);
app.use("/pedido", authenticate, pedidosRoutes);
app.use("/inscricao", authenticate, inscricoesRoutes);

app.listen(8000, () => {
  console.log("Servidor na porta 8000");
});