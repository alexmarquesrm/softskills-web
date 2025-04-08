const express = require("express");
const cors = require("cors");
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
const threadsAvaRoutes = require("./routes/threadsAvaRoutes");

// Use CORS middleware
app.use(cors());
app.options('*', cors());

//Use bodyParser middleware
app.use(bodyParser.json({ limit: '50mb' }));

app.use("/colaborador", colaboradorRoutes);
app.use("/formando", formandoRoutes);
app.use("/formador", formadoresRoutes);
app.use("/categoria", categoriasRoutes);
app.use("/area", areasRoutes);
app.use("/topico", topicosRoutes);
app.use("/forum", forumRoutes);
app.use("/thread", threadsRoutes);
app.use("/threadsAva", threadsAvaRoutes);

app.listen(8000, () => {
  console.log("Servidor na porta 8000");
});