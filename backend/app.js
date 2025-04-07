const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const colaboradorRoutes = require("./src/routes/usersRoutes");

app.use(bodyParser.json());
app.use("/colaboradores", colaboradorRoutes);

app.listen(3000, () => {
  console.log("Servidor na porta 3000");
});
