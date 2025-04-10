const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const colaborador = require("../models/colaborador");
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

  getAllCursos: async (req, res) => {
    try {
      const cursos = await models.curso.findAll({
        include: [
          {
            model: models.sincrono,
            as: "sincrono_curso",
            attributes: ["curso_id", "formador_id", "limite_vagas", "data_inicio", "data_fim", "estado"],
            include: [
              {
                model: models.formador,
                as: "sincrono_formador",
                attributes: ["formador_id", "especialidade"],
                include: [
                  {
                    model: models.colaborador,
                    as: "formador_colab",
                    attributes: ["nome", "email", "telefone"],
                  },
                ],
              },
            ],
          },
          {
            model: models.gestor,
            as: "gestor",
            attributes: ["gestor_id"],
            include: [
              {
                model: models.colaborador,
                as: "gestor_colab",
                attributes: ["nome", "email"],
              },
            ],
          },
          {
            model: models.topico,
            as: "topico",
            attributes: ["descricao"],
          },
        ],
        attributes: ["curso_id", "descricao", "tipo", "total_horas", "pendente"],
      });

      const cursosResumidos = await Promise.all(cursos.map(async (curso) => {
        let formadorDetalhes = null;
        if (curso.sincrono_curso?.sincrono_formador?.formador_id) {
          try {
            const formador = await models.formador.findByPk(curso.sincrono_curso.sincrono_formador.formador_id, {
              include: [
                {
                  model: models.credenciais,
                  as: "formador_credenciais",
                  include: [
                    {
                      model: models.colaborador,
                      as: "credenciais_colaborador",
                      attributes: ["nome", "email", "telefone"],
                    },
                  ],
                },
              ],
            });

            if (formador) {
              formadorDetalhes = formador;
            }
          } catch (error) {
            console.error("Erro ao obter dados do formador:", error);
          }
        }

        return {
          id: curso.curso_id,
          descricao: curso.descricao,
          tipo: curso.tipo,
          total_horas: curso.total_horas,
          pendente: curso.pendente,
          topico: curso.topico?.descricao || null,
          gestor: {
            nome: curso.gestor?.gestor_credenciais?.credenciais_colaborador?.nome || null,
            email: curso.gestor?.gestor_credenciais?.credenciais_colaborador?.email || null,
          },
          sincrono: curso.sincrono_curso ? {
            inicio: curso.sincrono_curso.data_inicio,
            fim: curso.sincrono_curso.data_fim,
            vagas: curso.sincrono_curso.limite_vagas,
            estado: curso.sincrono_curso.estado,
            formador: formadorDetalhes ? {
              formador_id: formadorDetalhes.id,
              especialidade: formadorDetalhes?.especialidade || null,
              colaborador: {
                nome: formadorDetalhes?.formador_credenciais?.credenciais_colaborador?.nome || null,
                email: formadorDetalhes?.formador_credenciais?.credenciais_colaborador?.email || null,
                telefone: formadorDetalhes?.formador_credenciais?.credenciais_colaborador?.telefone || null,
              },
              credenciais: {
                login: formadorDetalhes?.formador_credenciais?.login || null,
              }
            } : null,
          } : null,
        };
      }));

      res.json(cursosResumidos);
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
