const Sequelize = require("sequelize");
const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorThreads = {
  // Criar uma nova thread
  createThread: async (req, res) => {
    const { forum_id, colaborador_id, titulo, descricao } = req.body;
    
    try {
      const novaThread = await models.threads.create({ forum_id, colaborador_id, titulo, descricao });
      res.status(201).json(novaThread);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar a thread" });
    }
  },

  getAllThreads: async (req, res) => {
    try {
      const threads = await models.threads.findAll({
        include: [
          {
            model: models.forum,
            as: 'threads_forum',
          },
          {
            model: models.colaborador,
            as: 'colab_threads',
          },
          {
            model: models.threads_avaliacao,
            as: 'thread_threads_ava_',
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.fn('COUNT', Sequelize.col('thread_threads_ava_.thread_id')),
              'voto_count',
            ],
          ],
        },
        group: [
          'threads.thread_id',
          'threads_forum.forum_id',
          'colab_threads.colaborador_id'
        ],
      });
  
      if (!threads || threads.length === 0) {
        return res.status(200).json([]);
      }
  
      // Transform the data structure
      const result = threads.map(thread => {
        const threadJSON = thread.toJSON();
        
        // Create user object with colaborador data
        threadJSON.user = {
          colaborador_id: threadJSON.colab_threads.colaborador_id,
          nome: threadJSON.colab_threads.nome,
          cargo: threadJSON.colab_threads.cargo,
          departamento: threadJSON.colab_threads.departamento
        };

        // Remove the original colab_threads object
        delete threadJSON.colab_threads;
  
        return threadJSON;
      });
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao procurar threads' });
    }
  },
  

  // Obter uma thread por ID
  getThreadById: async (req, res) => {
    const { id } = req.params;

    try {
      const thread = await models.threads.findByPk(id, {
        include: [
          {
            model: models.forum,
            as: 'threads_forum',
            include: [
              {
                model: models.topico,
                as: 'forum_topico',
                include: [
                  {
                    model: models.area,
                    as: 'topico_area',
                    include: [
                      {
                        model: models.categoria,
                        as: 'area_categoria',
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: models.colaborador,
            as: 'colab_threads',
          },
          {
            model: models.threads_avaliacao,
            as: 'thread_threads_ava_',
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(`SUM(CASE WHEN thread_threads_ava_.vote = 1 THEN 1 ELSE 0 END)`),
              'votos_positivos',
            ],
            [
              Sequelize.literal(`SUM(CASE WHEN thread_threads_ava_.vote = -1 THEN 1 ELSE 0 END)`),
              'votos_negativos',
            ],
          ],
        },
        group: [
          'threads.thread_id',
          'threads_forum.forum_id',
          'colab_threads.colaborador_id',
          'threads_forum.forum_topico.topico_id',
          'threads_forum.forum_topico.topico_area.area_id',
          'threads_forum.forum_topico.topico_area.area_categoria.categoria_id'
        ],
      });

      if (!thread) {
        return res.status(404).json({ message: "Thread não encontrada" });
      }
  
      const result = thread.toJSON();
      result.user = {
        colaborador_id: result.colab_threads?.colaborador_id,
        nome: result.colab_threads?.nome,
        cargo: result.colab_threads?.cargo,
        departamento: result.colab_threads?.departamento
      };
      delete result.colab_threads;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar thread" });
    }
  },

  // Atualizar uma thread
  updateThread: async (req, res) => {
    const { id } = req.params;
    const { forum_id, user_id, titulo, descricao } = req.body;

    try {
      const thread = await models.threads.findByPk(id);
      if (!thread) {
        return res.status(404).json({ message: "Thread não encontrada" });
      }

      await thread.update({ forum_id, user_id, titulo, descricao });
      res.json({ message: "Thread atualizada com sucesso", thread });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar thread" });
    }
  },

  // Deletar uma thread
  deleteThread: async (req, res) => {
    const { id } = req.params;

    try {
      const thread = await models.threads.findByPk(id);
      if (!thread) {
        return res.status(404).json({ message: "Thread não encontrada" });
      }

      await thread.destroy();
      res.json({ message: "Thread apagada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar thread" });
    }
  },
};

module.exports = controladorThreads;
