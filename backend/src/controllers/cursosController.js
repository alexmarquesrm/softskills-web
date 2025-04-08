const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorCursos = {
  // Criar um novo curso
  createCurso: async (req, res) => {
    try {
      const {
        gestor_id,
        topico_id,
        tipo,
        total_horas,
        descricao,
        pendente,
        nivel,
      } = req.body;

      const novoCurso = await models.curso.create({
        gestor_id,
        topico_id,
        tipo,
        total_horas,
        descricao,
        pendente,
        nivel,
      });

      res.status(201).json(novoCurso);
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      res.status(500).json({ message: "Erro interno ao criar curso" });
    }
  },

  // Obter todos os cursos
  getAllCursos: async (req, res) => {
    try {
      const cursos = await models.curso.findAll({
        include: [
          {
            model: models.gestor,
            as: "gestor",
            attributes: ["gestor_id"],
            include: [
              {
                model: models.credenciais,
                as: "gestor_credenciais",
                attributes: ["colaborador_id"],
                include: [
                  {
                    model: models.colaborador,
                    as: "credenciais_colaborador",
                    attributes: [
                      "colaborador_id",
                      "nome",
                      "email",
                      "idade",
                      "cargo",
                      "departamento",
                      "telefone",
                      "score",
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: models.topico,
            as: "topico",
            attributes: ["topico_id", "descricao"],
          },
        ],
      });
      res.json(cursos);
    } catch (error) {
      console.error("Erro ao obter cursos:", error);
      res.status(500).json({ message: "Erro interno ao obter cursos" });
    }
  },

  // Obter um curso pelo ID
  getCursoById: async (req, res) => {
    try {
      const { id } = req.params;

      const curso = await models.curso.findByPk(id, {
        include: [
          {
            model: models.gestor,
            as: "gestor",
            attributes: ["gestor_id"],
            include: [
              {
                model: models.credenciais,
                as: "gestor_credenciais",
                attributes: ["colaborador_id"],
                include: [
                  {
                    model: models.colaborador,
                    as: "credenciais_colaborador",
                    attributes: [
                      "colaborador_id",
                      "nome",
                      "email",
                      "idade",
                      "cargo",
                      "departamento",
                      "telefone",
                      "score",
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: models.topico,
            as: "topico",
            attributes: ["topico_id", "descricao"],
          },
        ],
      });

      if (!curso) {
        return res.status(404).json({ message: "Curso não encontrado" });
      }

      res.json(curso);
    } catch (error) {
      console.error("Erro ao obter curso:", error);
      res.status(500).json({ message: "Erro interno ao obter curso" });
    }
  },

  // Atualizar um curso pelo ID
  updateCurso: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        gestor_id,
        topico_id,
        tipo,
        total_horas,
        descricao,
        pendente,
        nivel,
      } = req.body;

      const curso = await models.curso.findByPk(id);
      if (!curso) {
        return res.status(404).json({ message: "Curso não encontrado" });
      }

      await curso.update({
        gestor_id,
        topico_id,
        tipo,
        total_horas,
        descricao,
        pendente,
        nivel,
      });

      res.json({ message: "Curso atualizado com sucesso", curso });
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      res.status(500).json({ message: "Erro interno ao atualizar curso" });
    }
  },

  // Excluir um curso pelo ID
  deleteCurso: async (req, res) => {
    try {
      const { id } = req.params;

      const curso = await models.curso.findByPk(id);
      if (!curso) {
        return res.status(404).json({ message: "Curso não encontrado" });
      }

      await curso.destroy();
      res.json({ message: "Curso excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      res.status(500).json({ message: "Erro interno ao excluir curso" });
    }
  },
};

module.exports = controladorCursos;
