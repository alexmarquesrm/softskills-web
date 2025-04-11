const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const colaborador = require("../models/colaborador");
const models = initModels(sequelizeConn);

const controladorCursos = {
  // Criar um novo curso
  createCurso: async (req, res) => {
    const t = await sequelizeConn.transaction();
    try {
      const {
        gestor_id,
        topico_id,
        tipo,
        total_horas,
        descricao,
        pendente,
        nivel,
        sincrono
      } = req.body;

      // Criar o curso
      const novoCurso = await models.curso.create({
        gestor_id,
        topico_id,
        tipo,
        total_horas,
        descricao,
        pendente,
        nivel,
      }, { transaction: t });

      // Se for do tipo S (Sincrono), criar entrada na tabela sincrono
      if (tipo === "S" && sincrono) {
        await models.sincrono.create({
          ...sincrono,
          curso_id: novoCurso.curso_id
        }, { transaction: t });
      }

      await t.commit();

      res.status(201).json({ message: "Curso criado com sucesso", curso: novoCurso });

    } catch (error) {
      await t.rollback();
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
            as: "curso_sincrono",
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
            as: "curso_topico",
            attributes: ["descricao"],
          },
        ],
        attributes: ["curso_id", "titulo", "descricao", "tipo", "total_horas", "pendente", "nivel"],
      });

      const cursosResumidos = cursos.map((curso) => {
        return {
          id: curso.curso_id,
          titulo: curso.titulo,
          descricao: curso.descricao,
          tipo: curso.tipo,
          total_horas: curso.total_horas,
          pendente: curso.pendente,
          tipo: curso.tipo,
          topico: curso.curso_topico?.descricao || null,
          gestor: {
            nome: curso.gestor?.gestor_colab?.nome || null,
            email: curso.gestor?.gestor_colab?.email || null,
          },
          sincrono: curso.curso_sincrono ? {
            inicio: curso.curso_sincrono.data_inicio,
            fim: curso.curso_sincrono.data_fim,
            vagas: curso.curso_sincrono.limite_vagas,
            estado: curso.curso_sincrono.estado,
            formador: curso.curso_sincrono.sincrono_formador ? {
              formador_id: curso.curso_sincrono.sincrono_formador.formador_id,
              especialidade: curso.curso_sincrono.sincrono_formador.especialidade,
              colaborador: {
                nome: curso.curso_sincrono.sincrono_formador.formador_colab?.nome || null,
                email: curso.curso_sincrono.sincrono_formador.formador_colab?.email || null,
                telefone: curso.curso_sincrono.sincrono_formador.formador_colab?.telefone || null,
              }
            } : null
          } : null,
        };
      });

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
