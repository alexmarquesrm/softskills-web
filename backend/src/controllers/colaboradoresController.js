const initModels = require("../models/init-models");
const { generateToken } = require("../tokenUtils");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');
const bcrypt = require('bcrypt');

const controladorUtilizadores = {
  // Função para obter o próprio perfil do usuário autenticado
  getMe: async (req, res) => {
    try {
      // Obter ID do usuário a partir do token JWT
      const userId = req.user.id;

      const colaborador = await models.colaborador.findByPk(userId, {
        attributes: {
          exclude: ['pssword'],
        },
      });

      if (!colaborador) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const files = await ficheirosController.getFilesFromBucketOnly(userId, 'colaborador');

      const colaboradorData = colaborador.toJSON();
      if (files.length > 0) {
        colaboradorData.fotoPerfilUrl = files[0].url;
      }

      res.json(colaboradorData);
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      res.status(500).json({ message: "Erro ao obter perfil do usuário" });
    }
  },

  getAllColaboradores: async (req, res) => {
    try {
      const userRoles = req.user.allUserTypes?.split(',') || [];
      if (req.user.tipo !== 'Gestor' && !userRoles.includes('Gestor')) {
        return res.status(403).json({
          message: "Não autorizado a listar todos os colaboradores"
        });
      }

      const colaboradores = await models.colaborador.findAll({
        attributes: {
          exclude: ['pssword']
        }
      });
      res.json(colaboradores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao receber colaboradores" });
    }
  },

  getColaboradorById: async (req, res) => {
    const id = req.params.id;
    try {
      const isOwnProfile = parseInt(id) === req.user.id;
      const userRoles = req.user.allUserTypes?.split(',') || [];
      const isAdmin = req.user.tipo === 'Gestor' || userRoles.includes('Gestor');

      if (!isOwnProfile && !isAdmin) {
        return res.status(403).json({
          message: "Não autorizado a acessar perfil de outro usuário"
        });
      }

      const colaborador = await models.colaborador.findByPk(id, {
        attributes: {
          exclude: ['pssword'],
        },
        include: [
          {
            model: models.funcao,
            as: 'colab_funcao',
            attributes: ['nome'],
            include: [
              {
                model: models.departamento,
                as: 'funcao_departamento',
                attributes: ['nome'],
              }
            ]
          }
        ],
      });

      if (!colaborador) {
        return res.status(404).json({ message: "Colaborador não encontrado" });
      }

      // Check all possible roles
      const [formando, formador, gestor] = await Promise.all([
        models.formando.findOne({ where: { formando_id: id } }),
        models.formador.findOne({ where: { formador_id: id } }),
        models.gestor.findOne({ where: { gestor_id: id } })
      ]);

      // Collect all user types in an array
      const userTypes = [];
      if (formando) userTypes.push("Formando");
      if (formador) userTypes.push("Formador");
      if (gestor) userTypes.push("Gestor");

      // If no roles found, use "Desconhecido"
      if (userTypes.length === 0) {
        userTypes.push("Desconhecido");
      }

      const files = await ficheirosController.getFilesFromBucketOnly(id, 'colaborador');

      const colaboradorData = colaborador.toJSON();
      if (files.length > 0) {
        colaboradorData.fotoPerfilUrl = files[0].url;
      }

      // Adicionar tipos do user ao objeto de resposta
      colaboradorData.tipos = userTypes;
      colaboradorData.tipo = userTypes[0];

      res.json(colaboradorData);
    } catch (error) {
      console.error('Erro ao obter colaborador:', error);
      res.status(500).json({ message: "Erro ao obter colaborador" });
    }
  },

  getUserByLogin: async (req, res) => {
    const username = req.params.username;
    try {
      // Esta rota é usada para verificação na tela de login
      // Não retornar dados sensíveis
      const user = await models.colaborador.findOne({
        where: { username: username },
        attributes: ['colaborador_id', 'username']
      });

      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }

      // Retornar apenas informação mínima necessária
      res.json({
        exists: true,
        username: user.username
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao encontrar utilizador" });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await models.colaborador.findOne({
        where: { username }
      });

      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }

      const passwordMatch = await bcrypt.compare(password, user.pssword);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Password incorreta" });
      }

      // Check all possible roles
      const [formando, formador, gestor] = await Promise.all([
        models.formando.findOne({ where: { formando_id: user.colaborador_id } }),
        models.formador.findOne({ where: { formador_id: user.colaborador_id } }),
        models.gestor.findOne({ where: { gestor_id: user.colaborador_id } })
      ]);

      // Collect all user types in an array
      const userTypes = [];
      if (formando) userTypes.push("Formando");
      if (formador) userTypes.push("Formador");
      if (gestor) userTypes.push("Gestor");

      // If no roles found, use "Desconhecido"
      if (userTypes.length === 0) {
        userTypes.push("Desconhecido");
      }

      // Set default active type (first available role)
      const activeType = userTypes[0];

      const userData = {
        colaboradorid: user.colaborador_id,
        nome: user.nome,
        username: user.username,
        email: user.email,
        ultimologin: user.ultimologin,
        tipo: activeType,           // For backward compatibility
        allUserTypes: userTypes     // All available user types
      };

      // Atualizar último login
      await user.update({
        ultimologin: new Date()
      });

      // Gerar token JWT com os dados do usuário
      const token = generateToken({
        utilizadorid: user.colaborador_id,
        email: user.email,
        tipo: activeType,
        allUserTypes: userTypes.join(',')
      });

      // Obter saudação do banco de dados
      const [saudacaoResult] = await sequelizeConn.query(
        'SELECT obter_saudacao() as saudacao',
        { type: sequelizeConn.QueryTypes.SELECT }
      );

      // Retornar dados do usuário e token na mesma resposta
      res.status(200).json({
        user: userData,
        token: token,
        saudacao: saudacaoResult.saudacao
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no login" });
    }
  },

  // Este método pode ser removido, já que o token é gerado durante o login
  // Mantido para compatibilidade temporária, mas com verificação de segurança
  novoToken: async (req, res) => {
    const { id } = req.params;
    try {
      // Verificar se o ID é do próprio usuário autenticado
      if (parseInt(id) !== req.user.id) {
        return res.status(403).json({
          message: "Não autorizado a gerar token para outro usuário"
        });
      }

      const colaborador = await models.colaborador.findByPk(id);

      if (!colaborador) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }

      const token = generateToken({
        utilizadorid: colaborador.colaborador_id,
        email: colaborador.email,
        tipo: req.user.tipo // Manter o tipo atual
      });

      // Determinar saudação com base na hora do dia
      const hour = new Date().getHours();
      let saudacao = "Olá";

      if (hour < 12) {
        saudacao = "Bom dia";
      } else if (hour < 18) {
        saudacao = "Boa tarde";
      } else {
        saudacao = "Boa noite";
      }

      res.status(200).json({
        token: token,
        saudacao: saudacao
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao consultar utilizadores", details: error.message, });
    }
  },

  registarNovoColaborador: async (req, res) => {
    try {
      const { nome, email, data_nasc, cargo, departamento, telefone, score, sobre_mim, username, password } = req.body;

      // Verificar se username já existe
      const existingUser = await models.colaborador.findOne({
        where: { username }
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username já está em uso" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
        SELECT criar_colaborador_default_formando(
          :nome,
          :email,
          :data_nasc,
          :cargo,
          :departamento,
          :telefone,
          :score,
          :sobre_mim,
          :username,
          :hashedPassword
        )
      `;

      await sequelizeConn.query(sql, {
        replacements: {
          nome,
          email,
          data_nasc,
          cargo,
          departamento,
          telefone,
          score,
          sobre_mim,
          username,
          hashedPassword
        },
        type: sequelizeConn.QueryTypes.SELECT
      });

      res.status(201).json({ message: "Colaborador e formando default criados com sucesso." });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar colaborador." });
    }
  },

  criarColaborador: async (req, res) => {
    try {
      // Verificar se o usuário tem permissão de Gestor
      const userRoles = req.user.allUserTypes?.split(',') || [];
      if (req.user.tipo !== 'Gestor' && !userRoles.includes('Gestor')) {
        return res.status(403).json({
          message: "Não autorizado a criar colaboradores"
        });
      }

      const { nome, email, data_nasc, funcao_id, telefone, sobre_mim = null, score = 0, username, tipo, tipos, especialidade, inativo } = req.body;

      // Verificar se username já existe
      const existingUser = await models.colaborador.findOne({
        where: { username }
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username já está em uso" });
      }

      const hashedPassword = await bcrypt.hash("123", 10);
      let novoColaborador;

      // Se for Formando, usar a função do banco
      if (tipos?.includes("Formando")) {
        const sql = `
          SELECT criar_colaborador_default_formando( 
            :nome,
            :email,
            :data_nasc,
            :funcao_id,
            :telefone,
            :score,
            :sobre_mim,
            :username,
            :hashedPassword
          )`;

        await sequelizeConn.query(sql, {
          replacements: { nome, email, data_nasc, funcao_id, telefone, score, sobre_mim, username, hashedPassword },
          type: sequelizeConn.QueryTypes.SELECT,
        });

        // Buscar o colaborador criado
        novoColaborador = await models.colaborador.findOne({
          where: { username }
        });
      } else {
        // Se não for Formando, criar normalmente
        novoColaborador = await models.colaborador.create({
          nome,
          email,
          username,
          pssword: hashedPassword,
          data_nasc,
          funcao_id,
          telefone,
          sobre_mim,
          score: 0,
          inativo,
        });
      }

      // Se for Formador, criar o registro de formador
      if (tipos?.includes("Formador")) {
        await models.formador.create({
          formador_id: novoColaborador.colaborador_id,
          especialidade,
        });
      }

      // Se for Gestor, criar o registo de gestor
      if (tipos?.includes("Gestor")) {
        await models.gestor.create({
          gestor_id: novoColaborador.colaborador_id
        });
      }

      return res.status(201).json({
        message: "Colaborador criado com sucesso",
        colaborador: {
          id: novoColaborador.colaborador_id,
          tipos: tipos || [tipo]
        }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao criar colaborador" });
    }
  },

  updateColaborador: async (req, res) => {
    const id = req.params.id;

    try {
      // Verificar se o usuário está atualizando seu próprio perfil
      // ou se tem permissão administrativa
      const isOwnProfile = parseInt(id) === req.user.id;
      const userRoles = req.user.allUserTypes?.split(',') || [];
      const isAdmin = req.user.tipo === 'Gestor' || userRoles.includes('Gestor');

      if (!isOwnProfile && !isAdmin) {
        return res.status(403).json({
          message: "Não autorizado a atualizar perfil de outro usuário"
        });
      }

      const dadosAtualizados = { ...req.body };
      const novosTipos = dadosAtualizados.tipos || [];

      // Se vier uma nova password, fazer o hash
      if (dadosAtualizados.novaPassword) {
        const hashedPassword = await bcrypt.hash(dadosAtualizados.novaPassword, 10);
        dadosAtualizados.pssword = hashedPassword;
      }

      // Remover campos auxiliares que não existem na tabela
      delete dadosAtualizados.novaPassword;
      delete dadosAtualizados.confirmarPassword;
      delete dadosAtualizados.tipos;

      // Atualizar as informações do colaborador
      const updated = await models.colaborador.update(dadosAtualizados, {
        where: { colaborador_id: id },
      });

      if (updated[0]) {
        // Se vier uma nova foto de perfil, chamamos o ficheirosController
        if (dadosAtualizados.fotoPerfil) {
          await ficheirosController.adicionar(id, 'colaborador', [dadosAtualizados.fotoPerfil], req.user.id || null);
        }

        // Verificar e atualizar os tipos de usuário
        const [formando, formador, gestor] = await Promise.all([
          models.formando.findOne({ where: { formando_id: id } }),
          models.formador.findOne({ where: { formador_id: id } }),
          models.gestor.findOne({ where: { gestor_id: id } })
        ]);

        // Adicionar ou remover formando
        if (novosTipos.includes("Formando") && !formando) {
          await models.formando.create({ formando_id: id });
        } else if (!novosTipos.includes("Formando") && formando) {
          await formando.destroy();
        }

        // Adicionar ou remover formador
        if (novosTipos.includes("Formador") && !formador) {
          await models.formador.create({
            formador_id: id,
            especialidade: dadosAtualizados.especialidade || "Geral"
          });
        } else if (!novosTipos.includes("Formador") && formador) {
          await formador.destroy();
        }

        // Adicionar ou remover gestor
        if (novosTipos.includes("Gestor") && !gestor) {
          await models.gestor.create({ gestor_id: id });
        } else if (!novosTipos.includes("Gestor") && gestor) {
          await gestor.destroy();
        }

        // Retornar os dados atualizados do colaborador
        const updatedColaborador = await models.colaborador.findByPk(id, {
          attributes: {
            exclude: ['pssword']
          }
        });

        // Adicionar os tipos atualizados à resposta
        const colaboradorData = updatedColaborador.toJSON();
        colaboradorData.tipos = novosTipos;

        return res.json(colaboradorData);
      }

      res.status(404).json({ message: "Colaborador não encontrado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar colaborador" });
    }
  },

  deleteColaborador: async (req, res) => {
    const id = req.params.id;

    try {
      // Verificar se o usuário tem permissão administrativa
      const userRoles = req.user.allUserTypes?.split(',') || [];
      const isAdmin = req.user.tipo === 'Gestor' || userRoles.includes('Gestor');

      if (!isAdmin) {
        return res.status(403).json({
          message: "Não autorizado a excluir colaboradores"
        });
      }

      const deleted = await models.colaborador.destroy({
        where: { colaborador_id: id },
      });
      if (deleted) {
        return res.json({ message: "Colaborador removido com sucesso" });
      }
      res.status(404).json({ message: "Colaborador não encontrado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover colaborador" });
    }
  },

  getSaudacao: async (req, res) => {
    try {
      const sql = `
        SELECT obter_saudacao() as saudacao
      `;

      const [result] = await sequelizeConn.query(sql, {
        type: sequelizeConn.QueryTypes.SELECT
      });

      res.json({ saudacao: result.saudacao });
    } catch (error) {
      console.error('Erro ao obter saudação:', error);
      res.status(500).json({ message: "Erro ao obter saudação" });
    }
  },
};
module.exports = controladorUtilizadores;