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
      res.status(500).json({ message: "Erro ao receber dados do formandos" });
    }
  },
  
  getFormandoById: async (req, res) => {
    const { id } = req.params;
    try {
      const formando = await models.formando.findOne({
        where: { formando_id: id },
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

      if (!formando) {
        return res.status(404).json({ message: "Formando não encontrado" });
      }

      const formandoData = {
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

      res.json(formandoData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao receber dados do formando" });
    }
  },

  createFormando: async (req, res) => {
    const { colaborador_id, login, password } = req.body;

    try {
      const newCredenciais = await models.credenciais.create({
        colaborador_id,  
        login,            
        password,        
      });
      
      const newFormando = await models.formando.create({
        formando_id: newCredenciais.credencial_id,
      });
  
      res.status(201).json({
        formando_id: newFormando.formando_id,
        credencial_id: newCredenciais.credencial_id,
        login: newCredenciais.login,
        password: newCredenciais.password,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar o formando e credenciais" });
    }
  },

  updateFormando: async (req, res) => {
    const { id } = req.params;
    const { colaborador_id, login, password } = req.body;

    try {
      const formando = await models.formando.findOne({
        where: { formando_id: id },
      });

      if (!formando) {
        return res.status(404).json({ message: "Formando não encontrado" });
      }

      await models.credenciais.update(
        { colaborador_id, login, password },
        { where: { credencial_id: formando.formando_id } }
      );

      res.json({ message: "Formando atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar o formando" });
    }
  },

  deleteFormando: async (req, res) => {
    const { id } = req.params;

    try {
      const formando = await models.formando.findOne({
        where: { formando_id: id },
      });

      if (!formando) {
        return res.status(404).json({ message: "Formando não encontrado" });
      }

      await models.formando.destroy({
        where: { formando_id: id },
      });

      await models.credenciais.destroy({
        where: { credencial_id: formando.formando_id },
      });

      res.json({ message: "Formando apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar o formando" });
    }
  },

};
module.exports = controladorFormandos;
