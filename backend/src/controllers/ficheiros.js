const { Sequelize, Op, where } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const objStorage = require('../minio');
const models = initModels(sequelizeConn);

const controladorFicheiros = {
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
                    extensao: file.nome.split('.')[1],
                    tamanho: tamanho
                });
                
                try {
                    // Tentar fazer o upload do arquivo separadamente
                    await objStorage.insertFile(`${entidade}${id}`, file.base64, file.nome);
                } catch (uploadError) {
                    console.error('Erro no upload do arquivo para o armazenamento:', uploadError);
                    // Opcionalmente, pode-se excluir o registro do banco se o upload falhar
                    // await novoFicheiro.destroy();
                    // throw uploadError; // Você pode escolher se propaga o erro ou continua
                }
            }
    
            return true;
        } catch (error) {
            console.error('Não foi possível adicionar os ficheiros!', error);
            return false;
        }
    },

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
            } else {
                // Apagar todos os ficheiros associados ao objeto
                const ficheiros = await models.ficheiro.findAll({
                    where: {
                        objeto_id: objeto.objeto_id
                    }
                });

                // Apagar os ficheiros no MinIO e no banco de dados
                for (const ficheiro of ficheiros) {
                    await objStorage.deleteFile(`${entidade}_${id}`, ficheiro.nome);
                    await ficheiro.destroy();
                }
            }
        } catch (error) {
            console.error('Não foi possível remover os ficheiros!', error);
        }
    },

    getAllFilesByAlbum: async (id, entidade) => {
        try {
            const standardEntidade = entidade.toLowerCase();
            console.log(`Getting all files for ${standardEntidade}${id}`);
            
            const objeto = await models.objeto.findOne({
                where: {
                    registo_id: id,
                    entidade: standardEntidade
                }
            });
            if (!objeto) {
                console.error('O objeto não existe!');
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
                const presignedUrl = await objStorage.getPresignedUrl(`${standardEntidade}${id}`, ficheiro.nome);
                files.push({ nome: ficheiro.nome, url: presignedUrl });
            }

            return files;
        } catch (error) {
            console.error('Não foi possível recuperar os ficheiros!', error);
            return [];
        }
    },

    getFilesFromBucketOnly: async (id, entidade) => {
        try {
            const standardEntidade = entidade.toLowerCase();
            const bucketName = `${standardEntidade}${id}`;
            console.log(`Getting files directly from bucket: ${bucketName}`);
            
            const files = await objStorage.getFilesByBucket(bucketName);
            if (files.length > 0) {
                console.log(`Found ${files.length} files in bucket ${bucketName}`);
                console.log("First file URL:", files[0].url);
            } else {
                console.log(`No files found in bucket ${bucketName}`);
            }
            return files;
        } catch (error) {
            console.error('Erro ao buscar ficheiros no bucket:', error);
            return [];
        }
    },
}

module.exports = controladorFicheiros;
