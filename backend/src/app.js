const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const colaboradorRoutes = require("./routes/colaboradoresRoutes");
const formandoRoutes = require("./routes/formandosRoutes");
const formadoresRoutes = require("./routes/formadoresRoutes");
const categoriasRoutes = require("./routes/categoriasRoutes");
const areasRoutes = require("./routes/areasRoutes");
const topicosRoutes = require("./routes/topicosRoutes");
const forumRoutes = require("./routes/forumRoutes");
const threadsRoutes = require("./routes/threadsRoutes");

app.use(bodyParser.json());
app.use("/colaborador", colaboradorRoutes);
app.use("/formando", formandoRoutes);
app.use("/formador", formadoresRoutes);
app.use("/categoria", categoriasRoutes);
app.use("/area", areasRoutes);
app.use("/topico", topicosRoutes);
app.use("/forum", forumRoutes);
app.use("/thread", threadsRoutes);

app.listen(3000, () => {
  console.log("Servidor na porta 3000");
});