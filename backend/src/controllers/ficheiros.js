const { Sequelize, Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const objStorage = require('../minio');
const models = initModels(sequelizeConn);

const controladorFicheiros = {
    // Adicionar ficheiros para uma entidade e registro específico
    adicionar: async (id, entidade, files, userID) => {
        try {
            // Verificar ou criar o objeto
            let objeto = await models.objeto.findOne({
                where: {
                    registo_id: id,
                    entidade: entidade
                }
            });
            if (!objeto) {
                objeto = await models.objeto.create({
                    registo_id: id,
                    entidade: entidade
                });
            }
    
            // Inserir os ficheiros usando um loop for
            for (const file of files) {
                // Calculando o tamanho e arredondando para um inteiro
                const tamanho = file.tamanho ? Math.floor(file.tamanho) : Math.floor(file.base64.length * 0.75);
    
                // Criar ficheiro no banco de dados
                const novoFicheiro = await models.ficheiro.create({
                    objeto_id: objeto.objeto_id,
                    nome: file.nome,
                    extensao: file.nome.split('.').pop(),
                    tamanho: tamanho
                });
                
                try {
                    // Tentar fazer o upload do arquivo separadamente
                    await objStorage.insertFile(`${entidade}${id}`, file.base64, file.nome);
                } catch (uploadError) {
                    console.error('Erro no upload do arquivo para o armazenamento:', uploadError);
                    // Excluir o registro se o upload falhar
                    await novoFicheiro.destroy();
                    throw uploadError; // Propagar o erro
                }
            }
    
            return true;
        } catch (error) {
            console.error('Não foi possível adicionar os ficheiros!', error);
            return false;
        }
    },

    // Remover todos os ficheiros de uma entidade e registro
    removerTodosFicheirosAlbum: async (id, entidade) => {
        try {
            const objeto = await models.objeto.findOne({
                where: {
                    registo_id: id,
                    entidade: entidade
                }
            });

            if (!objeto) {
                console.error('O objeto não existe!');
                return false;
            } else {
                // Apagar todos os ficheiros associados ao objeto
                const ficheiros = await models.ficheiro.findAll({
                    where: {
                        objeto_id: objeto.objeto_id
                    }
                });

                // Apagar os ficheiros no MinIO e no banco de dados
                for (const ficheiro of ficheiros) {
                    await objStorage.deleteFile(`${entidade}${id}`, ficheiro.nome);
                    await ficheiro.destroy();
                }

                // Excluir o objeto
                await objeto.destroy();
                return true;
            }
        } catch (error) {
            console.error('Não foi possível remover os ficheiros!', error);
            return false;
        }
    },

    // Obter todos os ficheiros de uma entidade e registro
    getAllFilesByAlbum: async (id, entidade) => {
        try {
            const standardEntidade = entidade.toLowerCase();
            
            const objeto = await models.objeto.findOne({
                where: {
                    registo_id: id,
                    entidade: standardEntidade
                }
            });
            
            if (!objeto) {
                return [];
            }

            // Obter todos os ficheiros associados ao objeto
            const ficheiros = await models.ficheiro.findAll({
                where: {
                    objeto_id: objeto.objeto_id
                }
            });

            const files = [];
            for (const ficheiro of ficheiros) {
                try {
                    const presignedUrl = await objStorage.getPresignedUrl(`${standardEntidade}${id}`, ficheiro.nome);
                    files.push({ 
                        nome: ficheiro.nome, 
                        url: presignedUrl,
                        extensao: ficheiro.extensao,
                        tamanho: ficheiro.tamanho,
                        data_criacao: ficheiro.data_criacao
                    });
                } catch (err) {
                    console.error(`Erro ao obter URL assinada para ${ficheiro.nome}:`, err);
                }
            }

            return files;
        } catch (error) {
            console.error('Não foi possível recuperar os ficheiros!', error);
            return [];
        }
    },

    // Obter ficheiros diretamente do bucket MinIO
    getFilesFromBucketOnly: async (id, entidade) => {
        try {
            const standardEntidade = entidade.toLowerCase();
            const bucketName = `${standardEntidade}${id}`;
            
            const files = await objStorage.getFilesByBucket(bucketName);
            return files;
        } catch (error) {
            // Silently return empty array for any errors
            return [];
        }
    },

    // Nova função: obter conteúdo de um ficheiro específico
    getFileContent: async (id, entidade, fileName) => {
        try {
            const standardEntidade = entidade.toLowerCase();
            return await objStorage.getFileContent(`${standardEntidade}${id}`, fileName);
        } catch (error) {
            console.error(`Erro ao obter conteúdo do ficheiro ${fileName}:`, error);
            return null;
        }
    },

    // Nova função: atualizar um ficheiro existente
    updateFile: async (id, entidade, fileName, fileContent) => {
        try {
            const standardEntidade = entidade.toLowerCase();
            
            // procurar o objeto
            const objeto = await models.objeto.findOne({
                where: {
                    registo_id: id,
                    entidade: standardEntidade
                }
            });
            
            if (!objeto) {
                console.error('O objeto não existe!');
                return false;
            }
            
            // procurar o ficheiro
            const ficheiro = await models.ficheiro.findOne({
                where: {
                    objeto_id: objeto.objeto_id,
                    nome: fileName
                }
            });
            
            if (!ficheiro) {
                console.error('O ficheiro não existe!');
                return false;
            }
            
            // Atualizar tamanho se o conteúdo for fornecido
            if (fileContent) {
                // Calcular novo tamanho
                const tamanho = Math.floor(fileContent.length * 0.75);
                
                // Atualizar registro no banco
                await ficheiro.update({
                    tamanho: tamanho,
                    data_alteracao: new Date()
                });
                
                // Atualizar arquivo no MinIO
                await objStorage.insertFile(`${standardEntidade}${id}`, fileContent, fileName);
            }
            
            return true;
        } catch (error) {
            console.error(`Erro ao atualizar ficheiro ${fileName}:`, error);
            return false;
        }
    }
};

module.exports = controladorFicheiros;