const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const colaboradorRoutes = require("./routes/usersRoutes");
const formandoRoutes = require("./routes/formandosRoutes");

app.use(bodyParser.json());
app.use("/colaboradores", colaboradorRoutes);
app.use("/formandos", formandoRoutes);

app.listen(3000, () => {
  console.log("Servidor na porta 3000");
});
