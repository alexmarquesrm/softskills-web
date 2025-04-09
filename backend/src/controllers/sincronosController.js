const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorSincronos = {
  getAllSincronos: async (req, res) => {
    try {
      const sincronizados = await models.sincrono.findAll({
        include: [
          {
            model: models.curso,
            as: "sincrono_curso",
            attributes: ["curso_id", "tipo", "topico_id", "descricao", "total_horas", "pendente"],
            include: [
              {
                model: models.topico,
                as: "topico",
                attributes: ["topico_id", "descricao"],
                include: [
                  {
                    model: models.area,
                    as: "topico_area",
                    attributes: ["area_id", "descricao"],
                  },
                ],
              },
            ],
          },
          {
            model: models.formador,
            as: "formador",
            attributes: ["formador_id", "especialidade"],
            include: [
              {
                model: models.credenciais,
                as: "formador_credenciais",
                attributes: ["colaborador_id"],
                include: [
                  {
                    model: models.colaborador,
                    as: "credenciais_colaborador",
                    attributes: ["colaborador_id", "nome", "email"],
                  },
                ],
              },
            ],
          },
        ],
      });
      res.json(sincronizados);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
      res.status(500).json({ message: "Erro interno ao obter dados" });
    }
  },

  getSincronoById: async (req, res) => {
    try {
      const { id } = req.params;
      const sincronoData = await models.sincrono.findByPk(id, {
        include: [
          {
            model: models.formador,
            as: "formador",
            attributes: ["formador_id", "nome"],
          },
        ],
      });

      if (!sincronoData) {
        return res.status(404).json({ message: "Registro não encontrado" });
      }

      res.json(sincronoData);
    } catch (error) {
      console.error("Erro ao obter o registro:", error);
      res.status(500).json({ message: "Erro interno ao obter o registro" });
    }
  },

  createSincrono: async (req, res) => {
    try {
      const novoRegistro = await models.sincrono.create(req.body);
      res.status(201).json(novoRegistro);
    } catch (error) {
      console.error("Erro ao criar o registro:", error);
      res.status(500).json({ message: "Erro interno ao criar o registro" });
    }
  },

  updateSincrono: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await models.sincrono.update(req.body, {
        where: { curso_id: id },
      });

      if (!updated) {
        return res.status(404).json({ message: "Registro não encontrado" });
      }

      res.json({ message: "Registro atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar o registro:", error);
      res.status(500).json({ message: "Erro interno ao atualizar o registro" });
    }
  },

  // Deletar um registro pelo ID
  deleteSincrono: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await models.sincrono.destroy({
        where: { curso_id: id },
      });

      if (!deleted) {
        return res.status(404).json({ message: "Registro não encontrado" });
      }

      res.json({ message: "Registro deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar o registro:", error);
      res.status(500).json({ message: "Erro interno ao deletar o registro" });
    }
  },
};

module.exports = controladorSincronos;
