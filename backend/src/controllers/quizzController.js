const initModels = require('../models/init-models');
const sequelize = require('../bdConexao');
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

        try {
            const result = await sequelize.transaction(async (t) => {
                // Criar o quiz usando o model diretamente
                const quiz = await models.quizz.create({
                    curso_id,
                    gestor_id,
                    descricao,
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
        const { descricao, questoes } = req.body;

        try {
            const result = await sequelize.transaction(async (t) => {
                // Atualizar o quiz
                const quiz = await models.quizz.findByPk(req.params.quizzId);
                if (!quiz) {
                    throw new Error('Quiz não encontrado');
                }

                await quiz.update({
                    descricao,
                }, { transaction: t });

                // Deletar questões antigas
                await models.questoes_quizz.destroy({
                    where: { quizz_id: quiz.quizz_id },
                    transaction: t
                });

                // Criar novas questões
                for (const questao of questoes) {
                    await models.questoes_quizz.create({
                        quizz_id: quiz.quizz_id,
                        pergunta: questao.pergunta,
                        opcoes: questao.opcoes,
                        resposta_correta: questao.resposta_correta
                    }, { transaction: t });
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
                // Deletar questões primeiro
                await models.questoes_quizz.destroy({
                    where: { quizz_id: req.params.quizzId },
                    transaction: t
                });

                // Deletar o quiz
                const quiz = await models.quizz.findByPk(req.params.quizzId);
                if (!quiz) {
                    throw new Error('Quiz não encontrado');
                }

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
                // Buscar o quiz e suas questões
                const quiz = await models.quizz.findByPk(req.params.quizzId, {
                    include: [{
                        model: models.questoes_quizz,
                        as: 'questoes_quizzs'
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
                    if (resposta && resposta.resposta === questao.resposta_correta) {
                        pontuacao++;
                    }

                    // Salvar resposta do formando
                    await models.respostas_quizz.create({
                        formando_id,
                        questao_id: questao.questao_id,
                        resposta: resposta ? resposta.resposta : null
                    }, { transaction: t });
                }

                // Calcular nota final (0-100)
                const nota = (pontuacao / totalQuestoes) * 100;

                // Salvar avaliação
                await models.avaliacao_quizz.create({
                    formando_id,
                    quizz_id: quiz.quizz_id,
                    nota,
                    data_avaliacao: new Date()
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
    }
};

module.exports = quizzController; 