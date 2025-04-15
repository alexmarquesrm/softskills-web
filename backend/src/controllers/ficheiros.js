const { Sequelize, Op, where } = require('sequelize');
const initModels = require('../models/init-models');
const sequelizeConn = require('../bdConexao');
const objStorage = require('../minio');
const models = initModels(sequelizeConn);

const controladorFicheiros = {
    adicionar: async (id, entidade, files, userID) => {
        try {
            let objecto = await models.objecto.findOne({
                where:{
                    registoid: id,
                    entidade: entidade
                }
            });
            if (!objecto){
                objecto = await models.objecto.create({
                    registoid: id,
                    entidade: entidade
                });
            }

            let album = await models.album.findOne({
                where:{
                    objectoid: objecto.objectoid
                }
            });
            if (!album){
                album = await models.album.create({
                    objectoid: objecto.objectoid,
                    utilizadorid: userID,
                    descricao: `${entidade}${id}`
                });
            }

            for (const file of files){
                await models.ficheiro.create({
                    albumid: album.albumid,
                    nome: file.nome,
                    extensao: file.nome.split('.')[1],
                    tamanho: file.tamanho
                });

                objStorage.insertFile(album.descricao, file.base64, file.nome);
            }
            return true;
        } catch (error) {
            console.error('Não foi possível adicionar os ficheiros!', error);
            return false;
        }
    },

    removerTodosFicheirosAlbum: async (id, entidade, files) => {
        try {
            const objecto = await models.objecto.findOne({
                where:{
                    registoid: id,
                    entidade: entidade
                }
            });

            if (!objecto){
                console.error('O objeto não existe!');
            } else {
                const album = await models.album.findOne({
                    where:{
                        objectoid: objecto.objectoid
                    }
                });
                if (!album){
                    console.error('O album não existe!');
                } else {
                    objStorage.deleteAllFiles(album.descricao);
    
                    await models.ficheiro.destroy({
                        where: {
                            albumid: album.albumid
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Não foi possível remover os ficheiros!', error);
        }
    },

    getAllFilesByAlbum: async (id, entidade) => {
        try {
            const objecto = await models.objecto.findOne({
                where:{
                    registoid: id,
                    entidade: entidade
                }
            });
            if (!objecto){
                console.error('O objeto não existe!');
                return [];
            }

            const album = await models.album.findOne({
                where:{
                    objectoid: objecto.objectoid
                }
            });
            if (!album){
                console.error('O album não existe!');
                return [];
            }

            const objects = await objStorage.getFilesByBucket(album.descricao);
            return objects;
        } catch (error) {
            console.error('Não foi possível remover os ficheiros!', error);
            return false;
        }
    },
}

module.exports = controladorFicheiros