const initModels = require('../models/init-models');
const sequelize = require('../bdConexao');
const { Op } = require('sequelize');
const models = initModels(sequelize);

const quizzController = {
    // Buscar todos os quizzes de um curso
    getQuizzesByCurso: async (req, res) => {
        try {
            const quizzes = await models.quizz.findAll({
                where: { curso_id: req.params.cursoId },
                include: [{
                    model: models.questoes_quizz,
                    as: 'questoes_quizzs'
                }]
            });
            res.json({ success: true, data: quizzes });
        } catch (error) {
            console.error('Erro ao buscar quizzes:', error);
            res.status(500).json({ success: false, message: 'Erro ao buscar quizzes' });
        }
    },

    // Criar um novo quiz
    createQuiz: async (req, res) => {
        const { curso_id, descricao, questoes } = req.body;
        const gestor_id = req.user.id;

        // Validação dos dados
        if (!curso_id || !descricao || !questoes || questoes.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dados obrigatórios: curso_id, descricao e pelo menos uma questão' 
            });
        }

        // Validar cada questão
        for (const questao of questoes) {
            if (!questao.pergunta || !questao.opcoes || questao.opcoes.length < 2) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Cada questão deve ter uma pergunta e pelo menos 2 opções' 
                });
            }

            if (typeof questao.resposta_correta !== 'number' || 
                questao.resposta_correta < 0 || 
                questao.resposta_correta >= questao.opcoes.length) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Resposta correta deve ser um índice válido das opções' 
                });
            }

            // Verificar se todas as opções têm texto
            for (const opcao of questao.opcoes) {
                if (!opcao || opcao.trim() === '') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Todas as opções devem ter texto' 
                    });
                }
            }
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                // Criar o quiz usando o model diretamente
                const quiz = await models.quizz.create({
                    curso_id,
                    gestor_id,
                    descricao,
                    nota: 70.0 // Nota mínima padrão para passar no quiz (70%)
                }, { transaction: t });

                // Criar as questões e opções
                for (const questao of questoes) {
                    // Cria a questão
                    const questaoCriada = await models.questoes_quizz.create({
                        quizz_id: quiz.quizz_id,
                        pergunta: questao.pergunta
                    }, { transaction: t });

                    // Cria as opções para a questão
                    for (let i = 0; i < questao.opcoes.length; i++) {
                        await models.opcoes_quizz.create({
                            questao_id: questaoCriada.questao_id,
                            texto: questao.opcoes[i],
                            correta: i === questao.resposta_correta
                        }, { transaction: t });
                    }
                }

                return quiz;
            });

            res.json({ success: true, message: 'Quiz criado com sucesso', data: result });
        } catch (error) {
            console.error('Erro ao criar quiz:', error);
            res.status(500).json({ success: false, message: 'Erro ao criar quiz' });
        }
    },

    // Atualizar um quiz existente
    updateQuiz: async (req, res) => {
        const { descricao, questoes, nota } = req.body;

        try {
            const result = await sequelize.transaction(async (t) => {
                // Atualizar o quiz
                const quiz = await models.quizz.findByPk(req.params.quizzId);
                if (!quiz) {
                    throw new Error('Quiz não encontrado');
                }

                await quiz.update({
                    descricao,
                    nota: nota || 70.0 // Usar nota fornecida ou padrão de 70%
                }, { transaction: t });

                // Deletar opções e questões antigas (cascade delete)
                const questoesAntigas = await models.questoes_quizz.findAll({
                    where: { quizz_id: quiz.quizz_id },
                    transaction: t
                });

                for (const questaoAntiga of questoesAntigas) {
                    await models.opcoes_quizz.destroy({
                        where: { questao_id: questaoAntiga.questao_id },
                        transaction: t
                    });
                }

                await models.questoes_quizz.destroy({
                    where: { quizz_id: quiz.quizz_id },
                    transaction: t
                });

                // Criar novas questões e opções
                for (const questao of questoes) {
                    // Cria a questão
                    const questaoCriada = await models.questoes_quizz.create({
                        quizz_id: quiz.quizz_id,
                        pergunta: questao.pergunta
                    }, { transaction: t });

                    // Cria as opções para a questão
                    for (let i = 0; i < questao.opcoes.length; i++) {
                        await models.opcoes_quizz.create({
                            questao_id: questaoCriada.questao_id,
                            texto: questao.opcoes[i],
                            correta: i === questao.resposta_correta
                        }, { transaction: t });
                    }
                }

                return quiz;
            });

            res.json({ success: true, message: 'Quiz atualizado com sucesso', data: result });
        } catch (error) {
            console.error('Erro ao atualizar quiz:', error);
            res.status(500).json({ success: false, message: 'Erro ao atualizar quiz' });
        }
    },

    // Deletar um quiz
    deleteQuiz: async (req, res) => {
        try {
            const result = await sequelize.transaction(async (t) => {
                // Buscar o quiz
                const quiz = await models.quizz.findByPk(req.params.quizzId);
                if (!quiz) {
                    throw new Error('Quiz não encontrado');
                }

                // Deletar opções primeiro
                const questoes = await models.questoes_quizz.findAll({
                    where: { quizz_id: req.params.quizzId },
                    transaction: t
                });

                for (const questao of questoes) {
                    await models.opcoes_quizz.destroy({
                        where: { questao_id: questao.questao_id },
                        transaction: t
                    });
                }

                // Deletar questões
                await models.questoes_quizz.destroy({
                    where: { quizz_id: req.params.quizzId },
                    transaction: t
                });

                // Deletar o quiz
                await quiz.destroy({ transaction: t });
                return quiz;
            });

            res.json({ success: true, message: 'Quiz deletado com sucesso', data: result });
        } catch (error) {
            console.error('Erro ao deletar quiz:', error);
            res.status(500).json({ success: false, message: 'Erro ao deletar quiz' });
        }
    },

    // Submeter respostas de um quiz
    submitQuizAnswers: async (req, res) => {
        const { respostas } = req.body;
        const formando_id = req.user.id;

        try {
            const result = await sequelize.transaction(async (t) => {
                // Buscar o quiz e suas questões com opções
                const quiz = await models.quizz.findByPk(req.params.quizzId, {
                    include: [{
                        model: models.questoes_quizz,
                        as: 'questoes_quizzs',
                        include: [{
                            model: models.opcoes_quizz,
                            as: 'opcoes'
                        }]
                    }],
                    transaction: t
                });

                if (!quiz) {
                    throw new Error('Quiz não encontrado');
                }

                // Calcular pontuação
                let pontuacao = 0;
                const totalQuestoes = quiz.questoes_quizzs.length;

                for (const questao of quiz.questoes_quizzs) {
                    const resposta = respostas.find(r => r.questao_id === questao.questao_id);
                    
                    if (resposta) {
                        // Verificar se a opção selecionada é a correta
                        const opcaoSelecionada = questao.opcoes.find(opcao => opcao.opcao_id === resposta.opcao_id);
                        if (opcaoSelecionada && opcaoSelecionada.correta) {
                            pontuacao++;
                        }

                        // Salvar resposta do formando
                        await models.respostas_quizz.create({
                            formando_id,
                            questao_id: questao.questao_id,
                            opcao_id: resposta.opcao_id
                        }, { transaction: t });
                    }
                }

                // Calcular nota final (0-100)
                const nota = (pontuacao / totalQuestoes) * 100;

                // Salvar avaliação
                await models.avaliacao_quizz.create({
                    formando_id,
                    quizz_id: quiz.quizz_id,
                    nota
                }, { transaction: t });

                return { nota, pontuacao, totalQuestoes };
            });

            res.json({ success: true, message: 'Respostas submetidas com sucesso', data: result });
        } catch (error) {
            console.error('Erro ao submeter respostas:', error);
            res.status(500).json({ success: false, message: 'Erro ao submeter respostas' });
        }
    },

    getQuizById: async (req, res) => {
        try {
            const quiz = await models.quizz.findByPk(req.params.quizzId, {
                include: [{
                    model: models.questoes_quizz,
                    as: 'questoes_quizzs',
                    include: [{
                        model: models.opcoes_quizz,
                        as: 'opcoes'
                    }]
                }]
            });
            if (!quiz) {
                return res.status(404).json({ success: false, message: 'Quiz não encontrado' });
            }
            res.json({ success: true, data: quiz });
        } catch (error) {
            console.error('Erro ao buscar quiz:', error);
            res.status(500).json({ success: false, message: 'Erro ao buscar quiz' });
        }
    },

    // Verificar se o formando já respondeu ao quiz
    checkQuizCompletion: async (req, res) => {
        const formando_id = req.user.id;
        const quizz_id = req.params.quizzId;

        try {
            // Verificar se existe uma avaliação para este formando e quiz
            const avaliacao = await models.avaliacao_quizz.findOne({
                where: {
                    formando_id,
                    quizz_id
                }
            });

            if (avaliacao) {
                // Se existe avaliação, buscar também as respostas para mostrar detalhes
                const quiz = await models.quizz.findByPk(quizz_id, {
                    include: [{
                        model: models.questoes_quizz,
                        as: 'questoes_quizzs'
                    }]
                });

                const respostas = await models.respostas_quizz.findAll({
                    where: { 
                        formando_id,
                        questao_id: {
                            [Op.in]: quiz.questoes_quizzs.map(q => q.questao_id)
                        }
                    }
                });

                res.json({ 
                    success: true, 
                    completed: true, 
                    data: {
                        nota: avaliacao.nota,
                        respostas: respostas
                    }
                });
            } else {
                res.json({ 
                    success: true, 
                    completed: false 
                });
            }
        } catch (error) {
            console.error('Erro ao verificar conclusão do quiz:', error);
            res.status(500).json({ success: false, message: 'Erro ao verificar conclusão do quiz' });
        }
    }
};

module.exports = quizzController; 