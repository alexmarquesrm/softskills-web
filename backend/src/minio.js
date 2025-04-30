const minio = require('minio');
const fs = require('fs');
const stream = require('stream');
require('dotenv').config();

var minioClient = new minio.Client({
    endPoint: process.env[`MINIO_ENDPOINT`],
    port: parseInt(process.env[`MINIO_PORT`]),
    useSSL: false,
    accessKey: process.env[`MINIO_ROOT_USER`],
    secretKey: process.env[`MINIO_ROOT_PASSWORD`],
})

minioClient.listBuckets(function(err, buckets) {
    if (err) {
        return console.log('Erro ao listar os buckets:', err);
    }
});

const objectStorage = {
    insertFile: async function(bucketName, file, fileName){
        const standardBucketName = bucketName.toLowerCase();
        console.log(`Inserting file into bucket: ${standardBucketName}, filename: ${fileName}`);
        
        const exists = await minioClient.bucketExists(standardBucketName);

        if (!exists) {
            console.log(`Creating new bucket: ${standardBucketName}`);
            minioClient.makeBucket(standardBucketName, function (err) {
                if (err) return console.log('Error creating bucket with object lock.', err)
                console.log('Bucket created successfully and enabled object lock')
            });
            const versioningConfig = { Status: 'Suspended' }
            await minioClient.setBucketVersioning(standardBucketName, versioningConfig)
        }

        let base64Data;
        if (file.includes(";base64,")) {
            base64Data = file.split(";base64,")[1];
        } else {
            base64Data = file;
        }
        
        const buffer = Buffer.from(base64Data, 'base64');
        const readStream = new stream.PassThrough();
        readStream.end(buffer);

        return new Promise((resolve, reject) => {
            minioClient.putObject(standardBucketName, fileName, readStream, buffer.length, (err, objInfo) => {
                if (err) {
                    console.log('Error uploading object', err);
                    reject(err);
                } else {
                    console.log('Success uploading file', objInfo);
                    resolve(objInfo);
                }
            });
        });
    },

    deleteAllFiles: async function(bucketName){
        const standardBucketName = bucketName.toLowerCase();
        try{
            const objectNames = [];
            const objectsStream = minioClient.listObjects(standardBucketName, '', true)

            objectsStream.on('data', function (obj) {
                objectNames.push(obj.name)
            })
            
            objectsStream.on('error', function (e) {
                console.log(e)
            })

            objectsStream.on('end', function () {
                minioClient.removeObjects(standardBucketName, objectNames, function (e) {
                    if (e) {
                        return console.log('Unable to remove Objects ', e)
                    }
                    console.log('Removed the objects successfully')
                })
            })
        } catch (err){
            console.log('unable to remove all files.', err);
        }
    },

    getFilesByBucket: async function(bucketName) {
        const standardBucketName = bucketName.toLowerCase();
        console.log(`Getting files from bucket: ${standardBucketName}`);
        
        try {
            const exists = await minioClient.bucketExists(standardBucketName);
            if (!exists) {
                console.log(`Bucket ${standardBucketName} doesn't exist`);
                return [];
            }
        
            return new Promise((resolve, reject) => {
                const objectPromises = [];
        
                const stream = minioClient.listObjects(standardBucketName, '', true);
        
                stream.on('data', function(obj) {
                    const promise = new Promise((res, rej) => {
                        minioClient.presignedGetObject(standardBucketName, obj.name, 24 * 60 * 60, function(err, presignedUrl) {
                            if (err) return rej(err);
                            obj.url = presignedUrl;
                            console.log(`Generated URL for ${obj.name}: ${presignedUrl}`);
                            res(obj);
                        });
                    });
                    objectPromises.push(promise);
                });
        
                stream.on('end', function() {
                    Promise.all(objectPromises)
                        .then(objectsWithUrls => {
                            console.log(`Found ${objectsWithUrls.length} files in bucket ${standardBucketName}`);
                            resolve(objectsWithUrls);
                        })
                        .catch(err => {
                            console.error('Erro ao gerar URLs assinadas:', err);
                            reject(err);
                        });
                });
        
                stream.on('error', function(err) {
                    console.error('Erro ao listar objetos:', err);
                    reject(err);
                });
            });
        } catch (err) {
            console.error(`Error checking bucket ${standardBucketName}:`, err);
            return [];
        }
    },
    
    deleteFile: async function(bucketName, fileName) {
        const standardBucketName = bucketName.toLowerCase();
        return new Promise((resolve, reject) => {
            minioClient.removeObject(standardBucketName, fileName, function(err) {
                if (err) {
                    console.error(`Error deleting file ${fileName} from ${standardBucketName}:`, err);
                    reject(err);
                    return;
                }
                console.log(`Deleted ${fileName} from ${standardBucketName} successfully`);
                resolve(true);
            });
        });
    },
    
    getPresignedUrl: async function(bucketName, fileName) {
        const standardBucketName = bucketName.toLowerCase();
        return new Promise((resolve, reject) => {
            minioClient.presignedGetObject(standardBucketName, fileName, 24 * 60 * 60, function(err, presignedUrl) {
                if (err) {
                    console.error(`Error generating URL for ${fileName}:`, err);
                    reject(err);
                    return;
                }
                resolve(presignedUrl);
            });
        });
    }
}

module.exports = objectStorage;