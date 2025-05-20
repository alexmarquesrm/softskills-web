const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const models = initModels(sequelizeConn);
const ficheirosController = require('./ficheiros');

const materialTipos = {
    DOCUMENTO: 'documento',
    VIDEO: 'video',
    AULA: 'aula',
    TRABALHO: 'trabalho',
    ENTREGA: 'entrega'
};

const cursoMaterialController = {
    // Procurar materiais para um curso
    getMaterials: async (req, res) => {
        try {
            const { cursoId } = req.params;

            if (!cursoId) {
                return res.status(400).json({ success: false, message: 'ID do curso é obrigatório' });
            }

            // Verificar se o curso existe
            const curso = await models.curso.findByPk(cursoId);
            if (!curso) {
                return res.status(404).json({ success: false, message: 'Curso não encontrado' });
            }

            // procurar todos os materiais do curso
            const materiais = await models.material.findAll({
                where: { curso_id: cursoId },
                order: [['data_criacao', 'DESC']]
            });

            if (!materiais || materiais.length === 0) {
                return res.json({ success: true, data: [] });
            }

            // Para cada material, procurar seus ficheiros
            const materiaisResultados = await Promise.all(materiais.map(async (material) => {
                // procurar ficheiros para este material
                const ficheiros = await ficheirosController.getAllFilesByAlbum(
                    material.material_id,
                    `curso_${cursoId}_material`
                );

                return {
                    id: material.material_id,
                    titulo: material.titulo || 'Material sem título',
                    descricao: material.descricao || '',
                    tipo: material.tipo || 'documento',
                    secao: material.secao || 'Sem Seção',
                    data_criacao: material.data_criacao,
                    data_alteracao: material.data_alteracao,
                    data_entrega: material.data_entrega,
                    ficheiros: ficheiros
                };
            }));

            res.json({ success: true, data: materiaisResultados });
        } catch (error) {
            console.error('Erro ao procurar materiais do curso:', error);
            res.status(500).json({ success: false, message: 'Erro ao procurar materiais do curso' });
        }
    },

    // Adicionar um novo material ao curso
    addMaterial: async (req, res) => {
        try {
            const { cursoId } = req.params;
            const { titulo, descricao, tipo, dataEntrega, secao } = req.body;
            const ficheiros = req.body.ficheiros || [];

            // Validar campos obrigatórios
            if (!cursoId || !titulo || !tipo) {
                return res.status(400).json({
                    success: false,
                    message: 'Campos obrigatórios: cursoId, titulo, tipo'
                });
            }

            // Validar tipo de material
            if (!Object.values(materialTipos).includes(tipo)) {
                return res.status(400).json({
                    success: false,
                    message: `Tipo de material inválido. Tipos válidos: ${Object.values(materialTipos).join(', ')}`
                });
            }

            // Primeiro criar o registro do material no banco de dados
            const novoMaterial = await models.material.create({
                curso_id: cursoId,
                titulo,
                descricao,
                tipo,
                secao,
                data_entrega: dataEntrega,
            });

            // Se o material foi criado com sucesso e há ficheiros
            if (novoMaterial && ficheiros.length > 0) {
                try {
                    // Chamamos o ficheirosController para fazer o upload
                    const entidade = `material`;
                    await ficheirosController.adicionar(
                        novoMaterial.material_id,
                        entidade,
                        ficheiros,
                        req.user?.id || null
                    );
                } catch (uploadError) {
                    console.error('Erro ao fazer upload dos arquivos:', uploadError);
                    // Podemos deixar o material mesmo sem arquivos ou remover se quisermos
                    // await novoMaterial.destroy();
                    // return res.status(500).json({ 
                    //   success: false, 
                    //   message: 'Erro ao fazer upload dos arquivos do material' 
                    // });
                }
            }

            // Retornar os dados do material criado
            res.status(201).json({
                success: true,
                message: 'Material adicionado com sucesso',
                data: {
                    id: novoMaterial.material_id,
                    titulo: novoMaterial.titulo,
                    descricao: novoMaterial.descricao,
                    tipo: novoMaterial.tipo,
                    secao: novoMaterial.secao,
                    data_entrega: novoMaterial.data_entrega,
                    data_criacao: novoMaterial.data_criacao
                }
            });
        } catch (error) {
            console.error('Erro ao adicionar material ao curso:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao adicionar material ao curso'
            });
        }
    },

    // Atualizar um material existente
    updateMaterial: async (req, res) => {
        try {
            const { materialId } = req.params;
            const { titulo, descricao, dataEntrega, cursoId, tipo, secao } = req.body;
            const novosArquivos = req.body.ficheiros || [];

            if (!cursoId) {
                return res.status(400).json({ success: false, message: 'ID do curso é obrigatório' });
            }

            // procurar o material a ser atualizado
            const material = await models.material.findOne({
                where: {
                    material_id: materialId,
                    curso_id: cursoId
                }
            });

            if (!material) {
                return res.status(404).json({ success: false, message: 'Material não encontrado' });
            }

            // Dados para atualização
            const dadosAtualizados = {};
            if (titulo) dadosAtualizados.titulo = titulo;
            if (descricao !== undefined) dadosAtualizados.descricao = descricao;
            if (dataEntrega !== undefined) dadosAtualizados.data_entrega = dataEntrega;
            if (tipo && Object.values(materialTipos).includes(tipo)) dadosAtualizados.tipo = tipo;
            if (secao !== undefined) dadosAtualizados.secao = secao;
            dadosAtualizados.data_alteracao = new Date();

            // Atualizar o material no banco de dados
            await material.update(dadosAtualizados);

            // Se houver novos arquivos, fazer o upload
            if (novosArquivos.length > 0) {
                // Preparar arquivos para upload
                const filesForUpload = novosArquivos.map(file => ({
                    nome: file.nome || file.name,
                    base64: file.base64,
                    tamanho: file.tamanho || file.size || (file.base64 ? Math.floor(file.base64.length * 0.75) : 0)
                }));

                // Se houver arquivos existentes, remover todos antes de adicionar os novos
                await ficheirosController.removerTodosFicheirosAlbum(
                    material.material_id,
                    `curso_${cursoId}_material`
                );

                // Adicionar os novos arquivos
                await ficheirosController.adicionar(
                    material.material_id,
                    `curso_${cursoId}_material`,
                    filesForUpload,
                    req.user?.id
                );
            }

            // procurar material atualizado com seus arquivos
            const ficheiros = await ficheirosController.getAllFilesByAlbum(
                material.material_id,
                `curso_${cursoId}_material`
            );

            res.json({
                success: true,
                message: 'Material atualizado com sucesso',
                data: {
                    id: material.material_id,
                    titulo: material.titulo,
                    descricao: material.descricao,
                    tipo: material.tipo,
                    secao: material.secao,
                    data_criacao: material.data_criacao,
                    data_alteracao: material.data_alteracao,
                    data_entrega: material.data_entrega,
                    ficheiros: ficheiros
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar material:', error);
            res.status(500).json({ success: false, message: 'Erro ao atualizar material' });
        }
    },

    // Excluir um material e seus arquivos associados
    deleteMaterial: async (req, res) => {
        try {
            const { materialId } = req.params;
            const { cursoId } = req.body;

            if (!cursoId) {
                return res.status(400).json({ success: false, message: 'ID do curso é obrigatório' });
            }

            // procurar o material a ser excluído
            const material = await models.material.findOne({
                where: {
                    material_id: materialId,
                    curso_id: cursoId
                }
            });

            if (!material) {
                return res.status(404).json({ success: false, message: 'Material não encontrado' });
            }

            // Remover todos os arquivos associados ao material
            await ficheirosController.removerTodosFicheirosAlbum(
                material.material_id,
                `curso_${cursoId}_material`
            );

            // Remover o material do banco de dados
            await material.destroy();

            res.json({ success: true, message: 'Material excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir material:', error);
            res.status(500).json({ success: false, message: 'Erro ao excluir material' });
        }
    },

    // procurar um material específico pelo ID
    getMaterialById: async (req, res) => {
        try {
            const materialId = req.params.id;

            // procurar material pelo ID
            const material = await models.material.findByPk(materialId);

            if (!material) {
                return res.status(404).json({ message: "Material não encontrado" });
            }

            // procurar ficheiros associados, se existirem
            const files = await ficheirosController.getAllFilesByAlbum(materialId, 'material');

            const materialData = material.toJSON();
            materialData.ficheiros = files;

            return res.json(materialData);
        } catch (error) {
            console.error("Erro ao obter material:", error);
            return res.status(500).json({ message: "Erro ao obter material" });
        }
    }
};

module.exports = cursoMaterialController;