const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const colaboradorRoutes = require("./routes/colaboradoresRoutes");
const formandoRoutes = require("./routes/formandosRoutes");
const formadoresRoutes = require("./routes/formadoresRoutes");
const categoriasRoutes = require("./routes/categoriasRoutes");
const areasRoutes = require("./routes/areasRoutes");
const topicosRoutes = require("./routes/topicosRoutes");

app.use(bodyParser.json());
app.use("/colaboradores", colaboradorRoutes);
app.use("/formandos", formandoRoutes);
app.use("/formadores", formadoresRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/areas", areasRoutes);
app.use("/topicos", topicosRoutes);

app.listen(3000, () => {
  console.log("Servidor na porta 3000");
});