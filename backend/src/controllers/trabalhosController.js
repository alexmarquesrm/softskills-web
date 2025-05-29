const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');
const { Op } = require('sequelize');

const controladorTrabalhos = {
  // Obter todos os trabalhos dos formandos dos cursos do formador logado
  getTrabalhosFormandos: async (req, res) => {
    try {
      const formador_id = req.user.id; // ID do formador logado

      const trabalhos = await models.trabalho.findAll({
        include: [
          {
            model: models.formando,
            as: "formando",
            include: [
              {
                model: models.colaborador,
                as: "formando_colab",
                attributes: ["nome", "email"]
              }
            ]
          },
          {
            model: models.sincrono,
            as: "trabalho_sincrono",
            where: {
              formador_id: formador_id // Filtrar apenas cursos do formador logado
            },
            include: [
              {
                model: models.curso,
                as: "sincrono_curso",
                attributes: ["titulo", "descricao"]
              }
            ]
          }
        ]
      });

      // Transformar os dados para o formato desejado
      const formandosComTrabalhos = trabalhos.map(trab => ({
        formando_id: trab.formando_id,
        trabalho_id: trab.trabalho_id,
        nome: trab.formando.formando_colab.nome,
        email: trab.formando.formando_colab.email,
        avaliado: trab.nota !== null,
        nota: trab.nota,
        data_entrega: trab.data,
        descricao: trab.descricao,
        curso_titulo: trab.trabalho_sincrono?.sincrono_curso?.titulo || 'Curso não encontrado'
      }));

      res.json(formandosComTrabalhos);
    } catch (error) {
      console.error("Erro ao obter trabalhos dos formandos:", error);
      res.status(500).json({ message: "Erro interno ao obter trabalhos dos formandos" });
    }
  },

  // Avaliar um trabalho
  avaliarTrabalho: async (req, res) => {
    const { formando_id, trabalho_id, nota } = req.body;

    try {
      // Verificar se o trabalho existe e pertence ao formando
      const trabalho = await models.trabalho.findOne({
        where: { 
          trabalho_id,
          formando_id
        }
      });

      if (!trabalho) {
        return res.status(404).json({ message: "Trabalho não encontrado" });
      }

      // Atualizar a nota do trabalho
      await models.trabalho.update(
        { nota },
        { where: { trabalho_id } }
      );

      res.json({ message: "Trabalho avaliado com sucesso" });
    } catch (error) {
      console.error("Erro ao avaliar trabalho:", error);
      res.status(500).json({ message: "Erro interno ao avaliar trabalho" });
    }
  },

  // NOVO MÉTODO PARA SUBMISSÃO DE TRABALHO
  submeterTrabalho: async (req, res) => {
    try {
      const { curso_id, avaliacao_id, titulo, comentario, ficheiros } = req.body;
      const formando_id = req.user.id;

      // Criar o trabalho (nota a null)
      const novoTrabalho = await models.trabalho.create({
        sincrono_id: curso_id,
        formando_id,
        descricao: comentario || titulo,
        nota: null,
        data: new Date(),
        material_id: avaliacao_id
      });

      // Guardar ficheiros associados ao trabalho
      if (ficheiros && ficheiros.length > 0) {
        await ficheirosController.adicionar(
          novoTrabalho.trabalho_id,
          'trabalho',
          ficheiros,
          formando_id
        );
      }

      res.json({ success: true, message: "Trabalho submetido com sucesso", data: { trabalho_id: novoTrabalho.trabalho_id } });
    } catch (error) {
      console.error("Erro ao submeter trabalho:", error);
      res.status(500).json({ success: false, message: "Erro ao submeter trabalho" });
    }
  },

  // Obter submissão existente de um formando para uma avaliação específica
  getSubmissaoExistente: async (req, res) => {
    try {
      const { avaliacaoId, cursoId } = req.params;
      const formando_id = req.user.id;

      // Buscar o trabalho do formando para esta avaliação e curso
      const trabalho = await models.trabalho.findOne({
        where: {
          sincrono_id: cursoId,
          formando_id: formando_id,
          material_id: avaliacaoId
        },
        order: [['data', 'DESC']] // Pegar a submissão mais recente
      });

      if (!trabalho) {
        return res.json({ success: true, data: null });
      }

      // Buscar os ficheiros associados ao trabalho
      const ficheiros = await ficheirosController.getAllFilesByAlbum(
        trabalho.trabalho_id,
        'trabalho'
      );

      // Preparar a resposta
      const submissao = {
        trabalho_id: trabalho.trabalho_id,
        titulo: trabalho.descricao,
        comentario: trabalho.descricao,
        data_submissao: trabalho.data,
        ficheiros: ficheiros
      };

      res.json({ success: true, data: submissao });
    } catch (error) {
      console.error("Erro ao buscar submissão existente:", error);
      res.status(500).json({ success: false, message: "Erro ao buscar submissão existente" });
    }
  },

  // Apagar uma submissão de trabalho
  apagarTrabalho: async (req, res) => {
    try {
      const { trabalhoId } = req.params;
      const formando_id = req.user.id;

      // Verifica se o trabalho existe e pertence ao usuário
      const trabalho = await models.trabalho.findOne({
        where: {
          trabalho_id: trabalhoId,
          formando_id: formando_id
        }
      });

      if (!trabalho) {
        return res.status(404).json({ success: false, message: "Trabalho não encontrado ou não autorizado." });
      }

      // Apaga ficheiros associados
      await ficheirosController.removerTodosFicheirosAlbum(trabalhoId, 'trabalho');

      // Apaga o trabalho
      await models.trabalho.destroy({ where: { trabalho_id: trabalhoId } });

      res.json({ success: true, message: "Submissão removida com sucesso." });
    } catch (error) {
      console.error("Erro ao apagar submissão:", error);
      res.status(500).json({ success: false, message: "Erro ao apagar submissão." });
    }
  },

  // Obter todas as submissões dos formandos para uma avaliação específica
  getSubmissoesPorAvaliacao: async (req, res) => {
    try {
      const { avaliacaoId, cursoId } = req.params;
      // Buscar todos os trabalhos para o curso e avaliação
      const trabalhos = await models.trabalho.findAll({
        where: {
          sincrono_id: cursoId,
          material_id: avaliacaoId
        },
        include: [
          {
            model: models.formando,
            as: "formando",
            include: [
              {
                model: models.colaborador,
                as: "formando_colab",
                attributes: ["nome", "email"]
              }
            ]
          }
        ],
        order: [['data', 'DESC']]
      });

      // Filtrar trabalhos que correspondem à avaliação/material
      // (Se houver campo avaliacao_id/material_id, use aqui. Caso contrário, retorna todos do curso)
      // Exemplo: trabalhos.filter(t => t.avaliacao_id == avaliacaoId)

      const result = await Promise.all(trabalhos.map(async trab => {
        const ficheiros = await ficheirosController.getAllFilesByAlbum(trab.trabalho_id, 'trabalho');
        return {
          formando_id: trab.formando_id,
          trabalho_id: trab.trabalho_id,
          nome: trab.formando.formando_colab.nome,
          email: trab.formando.formando_colab.email,
          nota: trab.nota,
          data_submissao: trab.data,
          ficheiros: ficheiros
        };
      }));

      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Erro ao obter submissões por avaliação:", error);
      res.status(500).json({ success: false, message: "Erro ao obter submissões por avaliação" });
    }
  },

  // Obter trabalhos pendentes de um formando específico
  getTrabalhosPendentesFormando: async (req, res) => {
    try {
      const formando_id = req.user.id;

      // Verificar se o formando existe
      const formando = await models.formando.findByPk(formando_id);
      
      if (!formando) {
        return res.json({ success: true, data: [] });
      }

      // Buscar todas as inscrições ativas do formando
      const inscricoes = await models.inscricao.findAll({
        where: {
          formando_id: formando_id,
          estado: false // Apenas cursos ativos
          // data_atual maior que a data_inicio para mostrar
          
        },
        include: [
          {
            model: models.curso,
            as: "inscricao_curso",
            attributes: ['curso_id', 'titulo', 'tipo']
          }
        ]
      });

      let trabalhosPendentes = [];

      // Para cada inscrição, buscar materiais de entrega com prazo futuro
      for (const inscricao of inscricoes) {
        const materiais = await models.material.findAll({
          where: {
            curso_id: inscricao.curso_id,
            tipo: 'entrega',
            data_entrega: {
              [Op.gte]: new Date() // Prazo ainda não expirou
            }
          }
        });

        // Para cada material, verificar se o formando já submeteu
        for (const material of materiais) {
          const trabalhoExistente = await models.trabalho.findOne({
            where: {
              formando_id: formando_id,
              sincrono_id: inscricao.curso_id,
              material_id: material.material_id
            }
          });

          // Se não existe submissão, é um trabalho pendente
          if (!trabalhoExistente) {
            trabalhosPendentes.push({
              material_id: material.material_id,
              titulo: material.titulo,
              descricao: material.descricao,
              data_entrega: material.data_entrega,
              curso_id: inscricao.curso_id,
              curso_titulo: inscricao.inscricao_curso.titulo,
              tipo: 'entrega'
            });
          }
        }
      }

      // Ordenar por data de entrega mais próxima
      trabalhosPendentes.sort((a, b) => new Date(a.data_entrega) - new Date(b.data_entrega));

      res.json({ success: true, data: trabalhosPendentes });
    } catch (error) {
      console.error("Erro ao obter trabalhos pendentes:", error);
      res.status(500).json({ success: false, message: "Erro interno ao obter trabalhos pendentes" });
    }
  }
};

module.exports = controladorTrabalhos; 