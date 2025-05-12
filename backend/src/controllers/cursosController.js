const { Sequelize, QueryTypes, json, where, or } = require('sequelize');
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
        titulo,
        descricao,
        pendente,
        certificado,
        nivel,
        sincrono
      } = req.body;

      // Criar o curso
      const novoCurso = await models.curso.create({
        gestor_id,
        topico_id,
        tipo,
        total_horas,
        titulo,
        descricao,
        pendente,
        certificado,
        nivel
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

  getCountCursos: async (req, res) => {
    try {
      const totalCursos = await models.curso.count();
      res.status(200).json({ total: totalCursos });
    } catch (error) {
      console.error("Erro ao contar cursos:", error);
      res.status(500).json({ message: "Erro interno ao contar cursos" });
    }
  },

  getAllCursos: async (req, res) => {
    try {
      const cursos = await models.curso.findAll({
        include: [
          {
            model: models.sincrono,
            as: "curso_sincrono",
            attributes: ["curso_id", "formador_id", "limite_vagas", "data_limite_inscricao", "data_inicio", "data_fim", "estado"],
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
          nivel: curso.nivel,
          topico: curso.curso_topico?.descricao || null,
          gestor: {
            nome: curso.gestor?.gestor_colab?.nome || null,
            email: curso.gestor?.gestor_colab?.email || null,
          },
          curso_sincrono: curso.curso_sincrono ? {
            inicio: curso.curso_sincrono.data_inicio,
            fim: curso.curso_sincrono.data_fim,
            data_limite_inscricao: curso.curso_sincrono.data_limite_inscricao,
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

      res.json(cursos);
    } catch (error) {
      console.error("Erro ao obter cursos:", error);
      res.status(500).json({ message: "Erro interno ao obter cursos" });
    }
  },

  getAllLanding: async (req, res) => {
    try {
      // Query for top 3 synchronous courses
      const cursosSincronos = await sequelizeConn.query(`
        SELECT 
          curso.curso_id, 
          curso.titulo, 
          curso.descricao, 
          curso.tipo, 
          curso.total_horas, 
          curso.pendente, 
          curso.nivel, 
          COUNT(inscricao.curso_id) AS numero_inscricoes,
          topico.descricao AS topico_descricao,
          gestor_colab.nome AS gestor_nome,
          gestor_colab.email AS gestor_email,
          sincrono.data_inicio,
          sincrono.data_fim,
          sincrono.limite_vagas,
          sincrono.estado,
          formador_colab.nome AS formador_nome,
          formador_colab.email AS formador_email,
          formador_colab.telefone AS formador_telefone
        FROM 
          curso
        LEFT JOIN 
          inscricao ON curso.curso_id = inscricao.curso_id
        LEFT JOIN 
          sincrono ON curso.curso_id = sincrono.curso_id
        LEFT JOIN 
          formador AS sincrono_formador ON sincrono.formador_id = sincrono_formador.formador_id
        LEFT JOIN 
          colaborador AS formador_colab ON sincrono_formador.formador_id = formador_colab.colaborador_id
        LEFT JOIN 
          gestor ON curso.gestor_id = gestor.gestor_id
        LEFT JOIN 
          colaborador AS gestor_colab ON gestor.gestor_id = gestor_colab.colaborador_id 
        LEFT JOIN 
          topico ON curso.topico_id = topico.topico_id
        WHERE
          curso.tipo = 'S'  
        GROUP BY 
          curso.curso_id, curso.titulo, 
          curso.descricao, 
          curso.tipo, 
          curso.total_horas, 
          curso.pendente, 
          curso.nivel, 
          topico.descricao,
          gestor_colab.nome,
          gestor_colab.email,
          sincrono.data_inicio,
          sincrono.data_fim,
          sincrono.limite_vagas,
          sincrono.estado,
          formador_colab.nome,
          formador_colab.email,
          formador_colab.telefone
        ORDER BY 
          numero_inscricoes DESC
        LIMIT 3;
      `, { type: QueryTypes.SELECT });

      // Query for top 3 asynchronous courses
      const cursosAssincronos = await sequelizeConn.query(`
        SELECT 
          curso.curso_id, 
          curso.titulo, 
          curso.descricao, 
          curso.tipo, 
          curso.total_horas, 
          curso.pendente, 
          curso.nivel, 
          COUNT(inscricao.curso_id) AS numero_inscricoes,
          topico.descricao AS topico_descricao,
          gestor_colab.nome AS gestor_nome,
          gestor_colab.email AS gestor_email,
          sincrono.data_inicio,
          sincrono.data_fim,
          sincrono.limite_vagas,
          sincrono.estado,
          formador_colab.nome AS formador_nome,
          formador_colab.email AS formador_email,
          formador_colab.telefone AS formador_telefone
        FROM 
          curso
        LEFT JOIN 
          inscricao ON curso.curso_id = inscricao.curso_id
        LEFT JOIN 
          sincrono ON curso.curso_id = sincrono.curso_id
        LEFT JOIN 
          formador AS sincrono_formador ON sincrono.formador_id = sincrono_formador.formador_id
        LEFT JOIN 
          colaborador AS formador_colab ON sincrono_formador.formador_id = formador_colab.colaborador_id
        LEFT JOIN 
          gestor ON curso.gestor_id = gestor.gestor_id
        LEFT JOIN 
          colaborador AS gestor_colab ON gestor.gestor_id = gestor_colab.colaborador_id 
        LEFT JOIN 
          topico ON curso.topico_id = topico.topico_id
        WHERE
          curso.tipo = 'A'  
        GROUP BY 
          curso.curso_id, curso.titulo, 
          curso.descricao, 
          curso.tipo, 
          curso.total_horas, 
          curso.pendente, 
          curso.nivel, 
          topico.descricao,
          gestor_colab.nome,
          gestor_colab.email,
          sincrono.data_inicio,
          sincrono.data_fim,
          sincrono.limite_vagas,
          sincrono.estado,
          formador_colab.nome,
          formador_colab.email,
          formador_colab.telefone
        ORDER BY 
          numero_inscricoes DESC
        LIMIT 3;
      `, { type: QueryTypes.SELECT });

      // Process synchronous courses
      const sincronosResumidos = cursosSincronos.map((curso) => ({
        id: curso.curso_id,
        titulo: curso.titulo,
        descricao: curso.descricao,
        tipo: curso.tipo,
        total_horas: curso.total_horas,
        pendente: curso.pendente,
        nivel: curso.nivel,
        topico: curso.topico_descricao || null,
        gestor: {
          nome: curso.gestor_nome || null,
          email: curso.gestor_email || null,
        },
        sincrono: curso.data_inicio
          ? {
            inicio: curso.data_inicio,
            fim: curso.data_fim,
            vagas: curso.limite_vagas,
            estado: curso.estado,
            formador: curso.formador_nome
              ? {
                nome: curso.formador_nome || null,
                email: curso.formador_email || null,
                telefone: curso.formador_telefone || null,
              }
              : null,
          }
          : null,
        numero_inscricoes: curso.numero_inscricoes,
      }));

      // Process asynchronous courses
      const assincronosResumidos = cursosAssincronos.map((curso) => ({
        id: curso.curso_id,
        titulo: curso.titulo,
        descricao: curso.descricao,
        tipo: curso.tipo,
        total_horas: curso.total_horas,
        pendente: curso.pendente,
        nivel: curso.nivel,
        topico: curso.topico_descricao || null,
        gestor: {
          nome: curso.gestor_nome || null,
          email: curso.gestor_email || null,
        },
        sincrono: curso.data_inicio
          ? {
            inicio: curso.data_inicio,
            fim: curso.data_fim,
            vagas: curso.limite_vagas,
            estado: curso.estado,
            formador: curso.formador_nome
              ? {
                nome: curso.formador_nome || null,
                email: curso.formador_email || null,
                telefone: curso.formador_telefone || null,
              }
              : null,
          }
          : null,
        numero_inscricoes: curso.numero_inscricoes,
      }));

      // Combine both types and categorize them
      const result = {
        sincronos: sincronosResumidos,
        assincronos: assincronosResumidos
      };

      res.json(result);
    } catch (error) {
      console.error('Erro ao obter cursos:', error);
      res.status(500).json({ message: 'Erro interno ao obter cursos' });
    }
  },

  // Obter um curso pelo ID
  getCursoById: async (req, res) => {
    try {
      const { id } = req.params;

      const cursoBasico = await models.curso.findByPk(id);

      if (!cursoBasico) {
        return res.status(404).json({ message: "Curso não encontrado" });
      }

      const includes = [
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
          attributes: ["topico_id", "descricao"],
        }
      ];

      if (cursoBasico.tipo === 'S') {
        includes.push({
          model: models.sincrono,
          as: "curso_sincrono",
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
        });
      } else if (cursoBasico.tipo === 'A') {
        includes.push({
          model: models.assincrono,
          as: "curso_assincrono",
        });
      }

      const curso = await models.curso.findByPk(id, {include: includes});

      res.json(curso);
    } catch (error) {
      console.error("Erro ao obter curso:", error);
      res.status(500).json({ message: "Erro interno ao obter curso" });
    }
  },

  getCursosFormador: async (req, res) => {
    try {
      const { id } = req.params;

      const cursos = await models.curso.findAll({
        include: [
          {
            model: models.sincrono,
            as: "curso_sincrono",
            where: { formador_id: id },
            attributes: ["curso_id", "formador_id", "limite_vagas", "data_limite_inscricao", "data_inicio", "data_fim", "estado"],
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

      res.json(cursos);
    } catch (error) {
      console.error("Erro ao obter cursos do formador:", error);
      res.status(500).json({ message: "Erro interno ao obter cursos do formador" });
    }
  },

  // Obter alunos inscritos em um curso
  getAlunosInscritos: async (req, res) => {
    try {
      const { id } = req.params;

      const inscricoes = await models.inscricao.findAll({
        where: { curso_id: id },
        include: [
          {
            model: models.formando,
            as: "inscricao_formando",
            include: [
              {
                model: models.colaborador,
                as: "formando_colab",
                attributes: ["nome", "email"]
              }
            ]
          }
        ],
        attributes: ["inscricao_id", "tipo_avaliacao", "nota", "data_certificado", "data_inscricao", "estado"]
      });

      // Transformar os dados para o formato desejado
      const alunos = inscricoes.map(inscricao => ({
        id: inscricao.inscricao_formando.formando_id,
        nome: inscricao.inscricao_formando.formando_colab.nome,
        email: inscricao.inscricao_formando.formando_colab.email,
        tipo_avaliacao: inscricao.tipo_avaliacao,
        nota: inscricao.nota,
        data_certificado: inscricao.data_certificado,
        data_inscricao: inscricao.data_inscricao,
        estado: inscricao.estado ? 'Concluído' : 'Em curso'
      }));

      res.json({
        success: true,
        data: alunos,
        total: alunos.length
      });
    } catch (error) {
      console.error("Erro ao obter alunos inscritos:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno ao obter alunos inscritos" 
      });
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
