const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const formando = require("../models/formando");
const curso = require("../models/curso");
const models = initModels(sequelizeConn);

const controladorInscricoes = {
  // Criar uma nova inscrição
  async create(req, res) {
    const { formando_id, curso_id } = req.body;
    const transaction = await sequelizeConn.transaction();
    
    try {
      // Validar os dados
      if (!formando_id || !curso_id) {
        return res.status(400).json({
          erro: "formando_id e curso_id são obrigatórios"
        });
      }
      
      await sequelizeConn.query('CALL gerir_inscricao_curso($1, $2)', {
        bind: [parseInt(formando_id), parseInt(curso_id)],
        type: sequelizeConn.QueryTypes.RAW,
        transaction
      });
      
      // procurar a inscrição criada e devolver
      const novaInscricao = await models.inscricao.findOne({
        where: { 
          formando_id,
          curso_id
        },
        include: [
          {
            model: models.curso,
            as: "inscricao_curso"
          }
        ],
        transaction
      });

      // Commit da transação
      await transaction.commit();

      res.status(201).json(novaInscricao);
    } catch (error) {
      // Rollback da transação em caso de erro
      await transaction.rollback();
      
      console.error('Erro detalhado:', error);
      
      // Tratar erros específicos do procedimento
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('Curso não encontrado')) {
          return res.status(404).json({ erro: "Curso não encontrado" });
        } else if (error.message.includes('Formando já está inscrito')) {
          return res.status(400).json({ erro: "Formando já está inscrito neste curso" });
        } else if (error.message.includes('limite de vagas')) {
          return res.status(400).json({ erro: "Curso já atingiu o limite de vagas" });
        }
      }
      
      res.status(500).json({ 
        erro: "Erro ao criar inscrição", 
        detalhes: error.message || 'Erro desconhecido' 
      });
    }
  },

  // Listar todas as inscrições (apenas para gestores)
  async getAll(req, res) {
    try {
      // Verificar se o usuário é Gestor, seja como tipo ativo ou como um dos tipos disponíveis
      const userRoles = req.user.allUserTypes?.split(',') || [];

      if (req.user.tipo !== 'Gestor' && !userRoles.includes('Gestor')) {
        return res.status(403).json({
          erro: "Apenas administradores podem listar todas as inscrições"
        });
      }

      const inscricoes = await models.inscricao.findAll({
        include: [
          {
            model: models.curso,
            as: "inscricao_curso",
            include: [
              {
                model: models.topico,
                as: "curso_topico"
              },
              {
                model: models.sincrono,
                as: "curso_sincrono",
                attributes: ["curso_id", "formador_id", "limite_vagas", "data_limite_inscricao", "data_inicio", "data_fim", "estado"],
              }
            ]
          },
        ]
      });

      res.json(inscricoes);
    } catch (error) {
      console.error("Erro ao listar inscrições:", error);
      res.status(500).json({ erro: "Erro ao encontrar inscrições", detalhes: error.message });
    }
  },

  // Obter inscrições do formando autenticado
  async getMyInscricoes(req, res) {
    try {
      // Usar o ID do usuário autenticado a partir do token JWT
      const formandoId = req.user.id;

      const inscricoes = await models.inscricao.findAll({
        where: { formando_id: formandoId },
        include: [
          {
            model: models.curso,
            as: "inscricao_curso",
            include: [
              {
                model: models.topico,
                as: "curso_topico"
              },
              {
                model: models.sincrono,
                as: "curso_sincrono",
                attributes: ["curso_id", "formador_id", "limite_vagas", "data_limite_inscricao", "data_inicio", "data_fim", "estado"],
              }
            ]
          },
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
        ]
      });

      res.json(inscricoes);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao procurar inscrições", detalhes: error.message });
    }
  },

  // Obter inscrições de um formando específico (apenas para administradores ou para o próprio formando)
  async getByFormandoId(req, res) {
    try {
      const formandoId = parseInt(req.params.id);

      // Verificar se o usuário está tentando acessar seus próprios dados
      // ou se é um administrador
      if (formandoId !== req.user.id && req.user.tipo !== 'admin') {
        return res.status(403).json({
          erro: "Não autorizado a acessar inscrições de outro formando"
        });
      }

      const inscricoes = await models.inscricao.findAll({
        where: { formando_id: formandoId },
        include: [
          {
            model: models.curso,
            as: "inscricao_curso",
            include: [
              {
                model: models.topico,
                as: "curso_topico"
              }
            ],
            include: [
              {
                model: models.sincrono,
                as: "curso_sincrono"
              }
            ]
          },
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
        ]
      });

      if (inscricoes.length === 0) {
        return res.status(404).json({ erro: "Nenhuma inscrição encontrada para este formando" });
      }

      res.json(inscricoes);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao procurar inscrições", detalhes: error.message });
    }
  },

  // Obter uma inscrição específica pelo ID
  async getById(req, res) {
    try {
      const inscricaoId = parseInt(req.params.id);

      const inscricao = await models.inscricao.findByPk(inscricaoId, {
        include: [
          {
            model: models.curso,
            as: "inscricao_curso"
          }
        ]
      });

      if (!inscricao) {
        return res.status(404).json({ erro: "Inscrição não encontrada" });
      }

      // Verificar se a inscrição pertence ao usuário autenticado ou se é um admin
      if (inscricao.formando_id !== req.user.id && req.user.tipo !== 'admin') {
        return res.status(403).json({
          erro: "Não autorizado a acessar esta inscrição"
        });
      }

      res.json(inscricao);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao procurar inscrição", detalhes: error.message });
    }
  },

  // Atualizar uma inscrição
  async update(req, res) {
    try {
      const id = parseInt(req.params.id);

      // Verificar se a inscrição existe e pertence ao usuário autenticado
      const inscricao = await models.inscricao.findByPk(id);

      if (!inscricao) {
        return res.status(404).json({ erro: "Inscrição não encontrada para atualização" });
      }

      // Verificar se a inscrição pertence ao usuário autenticado ou se é um admin
      if (inscricao.formando_id !== req.user.id && req.user.tipo !== 'admin') {
        return res.status(403).json({
          erro: "Não autorizado a atualizar esta inscrição"
        });
      }

      // Impedir alteração do formando_id para manter a segurança
      if (req.body.formando_id && parseInt(req.body.formando_id) !== req.user.id && req.user.tipo !== 'admin') {
        return res.status(403).json({
          erro: "Não é permitido alterar o proprietário da inscrição"
        });
      }

      const [atualizado] = await models.inscricao.update(req.body, {
        where: { inscricao_id: id }
      });

      res.json({ mensagem: "Inscrição atualizada com sucesso" });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar inscrição", detalhes: error.message });
    }
  },

  // Excluir uma inscrição
  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);

      // Verificar se a inscrição existe e pertence ao usuário autenticado
      const inscricao = await models.inscricao.findByPk(id);

      if (!inscricao) {
        return res.status(404).json({ erro: "Inscrição não encontrada para exclusão" });
      }

      // Verificar se a inscrição pertence ao usuário autenticado ou se é um admin
      if (inscricao.formando_id !== req.user.id && req.user.tipo !== 'admin') {
        return res.status(403).json({
          erro: "Não autorizado a excluir esta inscrição"
        });
      }

      await models.inscricao.destroy({
        where: { inscricao_id: id }
      });

      res.json({ mensagem: "Inscrição deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao deletar inscrição", detalhes: error.message });
    }
  }
};

module.exports = controladorInscricoes;