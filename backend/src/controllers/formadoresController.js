const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const { get } = require("../routes/formandosRoutes");
const models = initModels(sequelizeConn);

const controladorFormadores = {
    getAllFormadores: async (req, res) => {
        try {
          const formadores = await models.formador.findAll({
            include: [
              {
                model: models.credenciais,
                as: "formador_credenciais",
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
            attributes: ["formador_id"],
          });
      
          const allFormadores = formadores.map((formador) => {
            return {
              id: formador.formador_id,
              login: formador.formador_credenciais.login,
              password: formador.formador_credenciais.password,
              colaborador: {
                nome: formador.formador_credenciais.credenciais_colaborador.nome,
                email: formador.formador_credenciais.credenciais_colaborador.email,
                telefone:
                  formador.formador_credenciais.credenciais_colaborador.telefone,
              },
            };
          });
      
          res.json(allFormadores);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Erro ao receber dados dos formadores" });
        }
      },
  
    getFormadorById: async (req, res) => {
        const { id } = req.params;
        try {
          const formador = await models.formador.findOne({
            where: { formador_id: id },
            include: [
              {
                model: models.credenciais,
                as: "formador_credenciais",
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
            attributes: ["formador_id"],
          });
  
          if (!formador) {
            return res.status(404).json({ message: "Formador não encontrado" });
          }
  
          const formadorData = {
            id: formador.formador_id,
            login: formador.formador_credenciais.login,
            password: formador.formador_credenciais.password,
            colaborador: {
              nome: formador.formador_credenciais.credenciais_colaborador.nome,
              email:
                formador.formador_credenciais.credenciais_colaborador.email,
              telefone:
                formador.formador_credenciais.credenciais_colaborador.telefone,
            },
          };
  
          res.json(formadorData);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Erro ao receber dados do formador" });
        }
      },

      createFormador: async (req, res) => {
        const { colaborador_id, especialidade } = req.body;

        try {
          const colaborador = await models.colaborador.findByPk(colaborador_id);
          console.log("Colaborador", colaborador);
          if (!colaborador) {
            return res.status(404).json({ message: "Colaborador não encontrado" });
          }
      
          const novoFormador = await models.formador.create({
            formador_id: colaborador.colaborador_id,
            especialidade,
          });
      
          res.status(201).json({
            message: "Formador criado com sucesso",
            formador: {
              id: novoFormador.formador_id,
              especialidade: novoFormador.especialidade,
            },
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Erro ao criar formador" });
        }
      },

      updateFormador: async (req, res) => {
        const { id } = req.params;
        const { colaborador_id, especialidade } = req.body;
    
        try {
          // Verificar se o formador existe
          const formador = await models.formador.findByPk(id);
          if (!formador) {
            return res.status(404).json({ message: "Formador não encontrado" });
          }
    
          // Atualizar os dados do formador
          await formador.update({ colaborador_id, especialidade });
    
          res.json({ message: "Formador atualizado com sucesso" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Erro ao atualizar formador" });
        }
      },

      deleteFormador: async (req, res) => {
        const { id } = req.params;
    
        try {
          // Verificar se o formador existe
          const formador = await models.formador.findByPk(id);
          if (!formador) {
            return res.status(404).json({ message: "Formador não encontrado" });
          }
    
          // Deletar o formador
          await formador.destroy();
    
          res.json({ message: "Formador apagado com sucesso" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Erro ao apagar formador" });
        }
      },

};
module.exports = controladorFormadores;
