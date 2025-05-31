const initModels = require("../models/init-models");
const { generateToken } = require("../tokenUtils");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../services/emailService');

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

      try {
        const files = await ficheirosController.getFilesFromBucketOnly(userId, 'colaborador');
        const colaboradorData = colaborador.toJSON();
        if (files && files.length > 0) {
          colaboradorData.fotoPerfilUrl = files[0].url;
        }
        res.json(colaboradorData);
      } catch (bucketError) {
        // Se houver erro ao buscar arquivos (bucket não existe), retornar dados sem foto
        const colaboradorData = colaborador.toJSON();
        res.json(colaboradorData);
      }
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

      // Verificar se é o primeiro login
      const isFirstLogin = !user.last_login;

      const userData = {
        colaboradorid: user.colaborador_id,
        nome: user.nome,
        username: user.username,
        email: user.email,
        ultimologin: user.last_login,
        tipo: activeType,           // For backward compatibility
        allUserTypes: userTypes,    // All available user types
        isFirstLogin               // Flag para indicar se é o primeiro login
      };

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
      const { nome, email, data_nasc, telefone, score, sobre_mim, username, password } = req.body;
      const funcao_id = null;

      // Novo: gerar username único (incremental se já existir)
      let finalUsername = username;
      let usernameExists = true;
      let counter = 1;
      while (usernameExists) {
        const existingUser = await models.colaborador.findOne({ where: { username: finalUsername } });
        if (!existingUser) {
          usernameExists = false;
        } else {
          finalUsername = `${username}${counter}`;
          counter++;
        }
      }

      const existingEmail = await models.colaborador.findOne({
        where: { email }
      });

      const existingTelefone = await models.colaborador.findOne({
        where: { telefone }
      });

      if (existingEmail) {
        return res.status(400).json({ message: "Email já está em uso" });
      }
      
      if (existingTelefone) {
        return res.status(500).json({ message: "Telefone já está em uso" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

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
          :hashedPassword,
          :last_login
        )
      `;

      await sequelizeConn.query(sql, {
        replacements: {
          nome,
          email,
          data_nasc,
          funcao_id,
          telefone,
          score,
          sobre_mim,
          username: finalUsername,
          hashedPassword,
          last_login: new Date()
        },
        type: sequelizeConn.QueryTypes.SELECT
      });

      // Tentar enviar email, mas não bloquear o registo se falhar
      try {
        const emailText = `
          Bem-vindo à Plataforma SoftSkills!
          
          A sua conta foi criada com sucesso. Aqui estão os seus dados de acesso:
          
          Nome de utilizador: ${finalUsername}
          Password: ${password}
          
          Se tiver alguma dúvida, não hesite em contactar-nos.
          
          Atenciosamente,
          Equipa SoftSkills
        `;

        await sendEmail(email, 'Bem-vindo à Plataforma SoftSkills', emailText);
      } catch (emailError) {
        console.warn('Erro ao enviar email:', emailError);
      }

      res.status(201).json({ 
        message: "Colaborador e formando default criados com sucesso.",
        emailSent: false // Indicar que o email não foi enviado
      });

    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
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

      // Gerar uma password aleatória
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
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
            :hashedPassword,
            :last_login
          )`;

        await sequelizeConn.query(sql, {
          replacements: { 
            nome, 
            email, 
            data_nasc, 
            funcao_id, 
            telefone, 
            score, 
            sobre_mim, 
            username, 
            hashedPassword,
            last_login: new Date()
          },
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
      
      // Enviar email com as credenciais
      const emailSent = await sendEmail(email, 'Bem-vindo à Plataforma SoftSkills', `
        Bem-vindo à Plataforma SoftSkills!
        
        A sua conta foi criada com sucesso. Aqui estão os seus dados de acesso:
        
        Nome de utilizador: ${username}
        Password: ${tempPassword}
        
        Por motivos de segurança, recomendamos que altere a sua password após o primeiro login.
        
        Se tiver alguma dúvida, não hesite em contactar-nos.
        
        Atenciosamente,
        Equipa SoftSkills
      `);
      
      if (!emailSent) {
        console.warn('Não foi possível enviar o email com as credenciais para:', email);
      }
      
      res.status(201).json({ 
        message: "Colaborador criado com sucesso.",
        emailSent: emailSent
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar colaborador." });
    }
  },

  updateColaborador: async (req, res) => {
    console.log("Dados recebidos:", req.body);
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

        // Adicionar ou remover formando (apenas se não houver referências)
        if (novosTipos.includes("Formando") && !formando) {
          await models.formando.create({ formando_id: id });
        } else if (!novosTipos.includes("Formando") && formando) {
          try {
            await formando.destroy();
          } catch (error) {
            // Se houver erro de foreign key, manter o tipo
            console.log("Não foi possível remover o tipo Formando devido a referências existentes");
          }
        }

        // Adicionar ou remover formador
        if (novosTipos.includes("Formador")) {
          if (!formador) {
            // Create new formador
            await models.formador.create({
              formador_id: id,
              especialidade: dadosAtualizados.especialidade || "Geral"
            });
          } else if (dadosAtualizados.especialidade) {
            // Update existing formador's especialidade
            await formador.update({
              especialidade: dadosAtualizados.especialidade
            });
          }
        } else if (formador) {
          try {
            await formador.destroy();
          } catch (error) {
            console.log("Não foi possível remover o tipo Formador devido a referências existentes");
          }
        }

        // Adicionar ou remover gestor
        if (novosTipos.includes("Gestor") && !gestor) {
          await models.gestor.create({ gestor_id: id });
        } else if (!novosTipos.includes("Gestor") && gestor) {
          try {
            await gestor.destroy();
          } catch (error) {
            console.log("Não foi possível remover o tipo Gestor devido a referências existentes");
          }
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

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Buscar o usuário
      const user = await models.colaborador.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }

      // Verificar a senha atual
      const passwordMatch = await bcrypt.compare(currentPassword, user.pssword);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Password atual incorreta" });
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Atualizar a senha e o último login
      await user.update({
        pssword: hashedPassword,
        last_login: new Date()
      });

      res.json({ message: "Password alterada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao alterar password" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Buscar o usuário pelo email
      const user = await models.colaborador.findOne({
        where: { email }
      });

      if (!user) {
        // Retornar sucesso mesmo se o email não existir por questões de segurança
        return res.json({ message: "Se o email estiver registado, receberá uma nova password em breve." });
      }

      // Gerar uma nova senha aleatória
      const newPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Atualizar a senha e limpar o último login
      await user.update({
        pssword: hashedPassword,
        last_login: null // Força a troca de senha no próximo login
      });

      // Enviar email com a nova senha
      const emailText = `
        Olá ${user.nome},

        A sua password foi redefinida com sucesso. Aqui está a sua nova password:

        Nova password: ${newPassword}

        Por motivos de segurança, será necessário alterar esta password no seu próximo login.

        Se não solicitou esta alteração, por favor contacte o administrador do sistema.

        Atenciosamente,
        Equipa SoftSkills
      `;

      await sendEmail(user.email, 'Redefinição de Password - SoftSkills', emailText);

      res.json({ message: "Se o email estiver registado, receberá uma nova password em breve." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao redefinir password" });
    }
  },

  googleLogin: async (req, res) => {
    try {
      const { googleId, email, name, photoURL } = req.body;

      // Check if user exists with this Google ID
      let colaborador = await models.colaborador.findOne({
        where: { google_id: googleId }
      });

      if (!colaborador) {
        // Check if user exists with this email
        colaborador = await models.colaborador.findOne({
          where: { email }
        });

        if (colaborador) {
          // Update existing user with Google ID
          await colaborador.update({ google_id: googleId });
        } else {
          // Generate username from name (firstname.lastname)
          const nameParts = name.split(' ');
          const firstName = nameParts[0].toLowerCase();
          const lastName = nameParts[nameParts.length - 1].toLowerCase();
          let username = `${firstName}.${lastName}`;
          
          // Check if username already exists and add a number if it does
          let usernameExists = true;
          let counter = 1;
          let finalUsername = username;
          
          while (usernameExists) {
            const existingUser = await models.colaborador.findOne({
              where: { username: finalUsername }
            });
            
            if (!existingUser) {
              usernameExists = false;
            } else {
              finalUsername = `${username}${counter}`;
              counter++;
            }
          }

          // Generate a unique phone number
          let phoneExists = true;
          let phoneNumber;
          while (phoneExists) {
            // Generate a random 9-digit number starting with 9
            phoneNumber = 900000000 + Math.floor(Math.random() * 100000000);
            
            // Check if phone number already exists
            const existingPhone = await models.colaborador.findOne({
              where: { telefone: phoneNumber }
            });
            
            if (!existingPhone) {
              phoneExists = false;
            }
          }

          const tempPassword = Math.random().toString(36).slice(-8); // Generate random password
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          // Create new colaborador
          colaborador = await models.colaborador.create({
            nome: name,
            email,
            username: finalUsername,
            pssword: hashedPassword,
            google_id: googleId,
            telefone: phoneNumber,
            score: 0,
            inativo: false,
            last_login: new Date()
          });

          // Create formando by default
          await models.formando.create({
            formando_id: colaborador.colaborador_id
          });
        }
      }

      // Update last login
      await colaborador.update({ last_login: new Date() });

      // Get user types
      const formando = await models.formando.findByPk(colaborador.colaborador_id);
      const formador = await models.formador.findByPk(colaborador.colaborador_id);
      const gestor = await models.gestor.findByPk(colaborador.colaborador_id);

      const allUserTypes = [];
      if (formando) allUserTypes.push('Formando');
      if (formador) allUserTypes.push('Formador');
      if (gestor) allUserTypes.push('Gestor');

      // Generate token using the existing function
      const token = generateToken({
        utilizadorid: colaborador.colaborador_id,
        email: colaborador.email,
        tipo: allUserTypes[0] || 'Formando',
        allUserTypes: allUserTypes.join(',')
      });

      // Get greeting
      const [saudacao] = await sequelizeConn.query('SELECT obter_saudacao() as saudacao');

      res.json({
        user: {
          ...colaborador.toJSON(),
          colaboradorid: colaborador.colaborador_id,
          allUserTypes
        },
        token,
        saudacao: saudacao[0].saudacao
      });
    } catch (error) {
      console.error('Erro no login com Google:', error);
      res.status(500).json({ message: "Erro ao fazer login com Google" });
    }
  },

  getFirebaseConfig: async (req, res) => {
    try {
      const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      };
      
      const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
      const missingFields = requiredFields.filter(field => !config[field]);
      
      if (missingFields.length > 0) {
        return res.status(500).json({ 
          message: 'Configuração do Firebase incompleta',
          missingFields 
        });
      }
      
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao obter configuração do Firebase' });
    }
  },

  registrarFcmToken: async (req, res) => {
    try {
      const { colaboradorid, fcmToken } = req.body;
      if (!colaboradorid || !fcmToken) {
        return res.status(400).json({ message: 'Dados insuficientes' });
      }
      await models.colaborador.update(
        { fcmtoken: fcmToken },
        { where: { colaborador_id: colaboradorid } }
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao registrar FCM token:', error);
      res.status(500).json({ message: 'Erro ao registrar FCM token' });
    }
  },
};
module.exports = controladorUtilizadores;