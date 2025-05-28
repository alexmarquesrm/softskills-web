const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');
const { Op } = require('sequelize');

const controladorTrabalhos = {
  // Obter todos os trabalhos dos formandos
  getTrabalhosFormandos: async (req, res) => {
    try {
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
          }
        ]
      });

      // Transformar os dados para o formato desejado
      const formandosComTrabalhos = trabalhos.map(trab => ({
        formando_id: trab.formando_id,
        trabalho_id: trab.trabalho_id,
        nome: trab.formando.formando_colab.nome,
        avaliado: trab.nota !== null,
        nota: trab.nota,
        data_entrega: trab.data,
        descricao: trab.descricao
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

      // Buscar todas as inscrições do formando que ainda não foram concluídas (nota é null)
      const inscricoes = await models.inscricao.findAll({
        where: {
          formando_id: formando_id,
          nota: null // Apenas cursos não concluídos
        },
        include: [
          {
            model: models.curso,
            as: "inscricao_curso",
            attributes: ['curso_id', 'titulo', 'tipo'],
            include: [
              {
                model: models.sincrono,
                as: "curso_sincrono",
                attributes: ['data_inicio', 'data_fim', 'estado'],
                required: false // LEFT JOIN para incluir cursos assíncronos
              }
            ]
          }
        ]
      });

      let trabalhosPendentes = [];

      // Para cada inscrição não concluída, verificar se há trabalhos pendentes
      for (const inscricao of inscricoes) {
        const curso = inscricao.inscricao_curso;
        // Buscar materiais de entrega com prazo futuro para este curso
        const materiais = await models.material.findAll({
          where: {
            curso_id: inscricao.curso_id,
            tipo: {
              [Op.in]: ['entrega'] // Buscar apenas entregas
            },
            data_entrega: {
              [Op.gte]: new Date() // Prazo ainda não expirou
            }
          }
        });

        console.log(`Curso ${curso.curso_id}: encontrados ${materiais.length} materiais de entrega`);

        // Para cada material, verificar se o formando já submeteu
        for (const material of materiais) {
          console.log(`Verificando material ${material.material_id}: ${material.titulo}`);
          
          // Verificar se o formando já submeteu para este material
          // Usar curso_id diretamente em vez de sincrono_id para compatibilidade com todos os tipos de curso
          const trabalhoExistente = await models.trabalho.findOne({
            where: {
              formando_id: formando_id,
              material_id: material.material_id
            }
          });

          console.log(`Material ${material.material_id} - trabalho já submetido: ${!!trabalhoExistente}`);

          // Se não existe submissão, é um trabalho pendente
          if (!trabalhoExistente) {
            console.log(`Adicionando trabalho pendente: ${material.titulo}`);
            trabalhosPendentes.push({
              material_id: material.material_id,
              titulo: material.titulo,
              descricao: material.descricao,
              data_entrega: material.data_entrega,
              curso_id: inscricao.curso_id,
              curso_titulo: curso.titulo,
              tipo: material.tipo // Usar o tipo real do material
            });
          }
        }
      }

      // Ordenar por data de entrega mais próxima
      trabalhosPendentes.sort((a, b) => new Date(a.data_entrega) - new Date(b.data_entrega));
      console.log("Trabalhos pendentes encontrados:", trabalhosPendentes.length);
      
      res.json({ success: true, data: trabalhosPendentes });
    } catch (error) {
      console.error("Erro ao obter trabalhos pendentes:", error);
      res.status(500).json({ success: false, message: "Erro interno ao obter trabalhos pendentes" });
    }
  }
};

module.exports = controladorTrabalhos; 