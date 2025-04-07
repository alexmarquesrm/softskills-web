const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorFormandos = {
  getAllFormandos: async (req, res) => {
    try {
      const formandos = await models.formando.findAll({
        include: [
          {
            model: models.credenciais,
            as: "formando_credenciais",
            required: true,
            include: [
              {
                model: models.colaborador,
                as: "credenciais_colaborador",
                required: true,
                attributes: ["nome", "email", "telefone"],
              },
            ],
            attributes: ["login", "password"],
          },
        ],
        attributes: ["formando_id"],
      });

      const allformandos = formandos.map((formando) => {
        return {
          id: formando.formando_id,
          login: formando.formando_credenciais.login,
          password: formando.formando_credenciais.password,
          colaborador: {
            nome: formando.formando_credenciais.credenciais_colaborador.nome,
            email: formando.formando_credenciais.credenciais_colaborador.email,
            telefone:
              formando.formando_credenciais.credenciais_colaborador.telefone,
          },
        };
    });
    
      res.json(allformandos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao receber formandos" });
    }
  },
};
module.exports = controladorFormandos;
