const minio = require('minio');
const fs = require('fs');
const stream = require('stream');
require('dotenv').config();

var minioClient = new minio.Client({
    endPoint: process.env[`MINIO_ENDPOINT`],
    port: parseInt(process.env[`MINIO_PORT`]),
    useSSL: true,
    accessKey: process.env[`MINIO_ACCESSKEY`],
    secretKey: process.env[`MINIO_SECRETKEY`],
})

const objectStorage = {
    insertFile: async function(bucketName, file, fileName){
        const exists = await minioClient.bucketExists(bucketName.toLowerCase());

        if (!exists) {
            minioClient.makeBucket(bucketName.toLowerCase(), function (err) {
                if (err) return console.log('Error creating bucket with object lock.', err)
                console.log('Bucket created successfully and enabled object lock')
            });
            const versioningConfig = { Status: 'Suspended' }
            await minioClient.setBucketVersioning(bucketName.toLowerCase(), versioningConfig)
        }

        const base64Data = file.split(";base64,")[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const readStream = new stream.PassThrough();
        readStream.end(buffer);

        minioClient.putObject(bucketName.toLowerCase(), fileName, readStream, buffer.length, (err, objInfo) => {
            if (err) {
                console.log('Error uploading object', err);
            } else {
                console.log('Success', objInfo);
            }
        });
    },

    deleteAllFiles: async function(bucketName){
        try{
            const objectNames = [];
            const objectsStream = minioClient.listObjects(bucketName.toLowerCase(), '', true)

            objectsStream.on('data', function (obj) {
                objectNames.push(obj.name)
            })
            
            objectsStream.on('error', function (e) {
                console.log(e)
            })

            objectsStream.on('end', function () {
                minioClient.removeObjects(bucketName.toLowerCase(), objectNames, function (e) {
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

    getFilesByBucket: async function(bucketName){
        const data = [];
        const exists = await minioClient.bucketExists(bucketName.toLowerCase());
        if (exists){
            var stream = minioClient.listObjects(bucketName.toLowerCase(), '', true);

            return new Promise((resolve, reject) => {
                const objects = [];
                stream.on('data', function (obj) {
                    minioClient.presignedGetObject(bucketName.toLowerCase(), obj.name, 24 * 60 * 60, function (err, presignedUrl) {
                        if (err) return console.log(err);
                        obj.url = presignedUrl;
                    });
                    objects.push(obj);
                });

                stream.on('end', function () {
                    if (objects.length < 1) {
                        console.log('No objects found in the bucket.');
                    }
                    resolve(objects);
                });

                stream.on('error', function (err) {
                    console.log('Error listing objects:', err);
                    reject(err);
                });
            });
        }
        return data;
    }
}

module.exports = objectStorage;