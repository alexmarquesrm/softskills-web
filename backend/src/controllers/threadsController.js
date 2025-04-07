const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorThreads = {
  // Criar uma nova thread
  createThread: async (req, res) => {
    const { forum_id, user_id, titulo, descricao } = req.body;
    
    try {
      const novaThread = await models.threads.create({ forum_id, user_id, titulo, descricao });
      res.status(201).json(novaThread);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar a thread" });
    }
  },

  // Obter todas as threads
  getAllThreads: async (req, res) => {
    try {
      const threads = await models.threads.findAll({
        include: [
          {
            model: models.forum,
            as: 'threads_forum',
          },
          {
            model: models.credenciais,
            as: 'user',
            include: [
              {
                model: models.colaborador,
                as: 'credenciais_colaborador',
                attributes: ['colaborador_id', 'nome', 'email', 'idade', 'cargo', 'departamento', 'telefone', 'score'],
              },
            ],
          },
        ],
      });
  
      if (!threads || threads.length === 0) {
        return res.status(404).json({ message: "Threads não encontradas" });
      }
  
      // Manipula o retorno para incluir 'user_id' e mover 'credenciais_colaborador' para a estrutura correta
      const result = threads.map(thread => {
        const threadJSON = thread.toJSON();
  
        // Adiciona o 'user_id' diretamente no resultado
        threadJSON.user_id = threadJSON.user.credencial_id;
  
        // Mover 'credenciais_colaborador' para baixo de 'user_id'
        threadJSON.user_id = {
          ...threadJSON.user_id,
          credenciais_colaborador: threadJSON.user.credenciais_colaborador,
        };
  
        // Remove os campos desnecessários
        delete threadJSON.user.credencial_id;
        delete threadJSON.user.credenciais_colaborador;
        delete threadJSON.user;
        delete threadJSON.user_id.credenciais_colaborador.email;
        delete threadJSON.user_id.credenciais_colaborador.idade;
        delete threadJSON.user_id.credenciais_colaborador.cargo;
        delete threadJSON.user_id.credenciais_colaborador.departamento;
        delete threadJSON.user_id.credenciais_colaborador.telefone;
        delete threadJSON.user_id.credenciais_colaborador.score;
  
        return threadJSON;
      });
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao procurar threads" });
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
            model: models.credenciais,
            as: 'user',
            include: [
                {
                    model: models.colaborador,
                    as: 'credenciais_colaborador',
                }
            ],
          },
        ],
      });

      if (!thread) {
        return res.status(404).json({ message: "Thread não encontrada" });
      }
  
    const result = thread.toJSON();
    result.user_id = result.user.credencial_id;  // Adiciona o 'user_id' diretamente no resultado

    // Move 'credenciais_colaborador' para baixo de 'user_id'
    result.user_id = {
      ...result.user_id,
      credenciais_colaborador: result.user.credenciais_colaborador // Mova diretamente
    };

    // Remove os campos desnecessários
    delete result.user.credencial_id;
    delete result.user.credenciais_colaborador;
    delete result.user;
    delete result.user_id.credenciais_colaborador.email;
    delete result.user_id.credenciais_colaborador.idade;
    delete result.user_id.credenciais_colaborador.cargo;
    delete result.user_id.credenciais_colaborador.departamento;
    delete result.user_id.credenciais_colaborador.telefone;
    delete result.user_id.credenciais_colaborador.score;

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
