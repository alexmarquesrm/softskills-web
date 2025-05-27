const Minio = require('minio');
const fs = require('fs');
require('dotenv').config();

const minioClient = new Minio.Client({
  endPoint: process.env[`MINIO_ENDPOINT`],
  port: parseInt(process.env[`MINIO_PORT`]),
  useSSL: false,
  accessKey: process.env[`MINIO_ROOT_USER`],
  secretKey: process.env[`MINIO_ROOT_PASSWORD`],
});

// Lista de arquivos de exemplo para upload
const files = [
  // Material 1: Introdução ao JavaScript (ID: 1)
  { local: './exemplos/introducao_js.pdf', bucket: 'material1', name: 'introducao_js.pdf' },

  // Material 2: Variáveis e Tipos de Dados (ID: 2)
  { local: './exemplos/variaveis_js.pdf', bucket: 'material2', name: 'variaveis_js.pdf' },

  // Material 3: Funções em JavaScript (ID: 3)
  { local: './exemplos/funcoes_js.mp4', bucket: 'material3', name: 'funcoes_js.mp4' },

  // Material 4: Arrays e Objetos (ID: 4)
  { local: './exemplos/arrays_objetos.pdf', bucket: 'material4', name: 'arrays_objetos.pdf' },

  // Material 5: Projeto Final JavaScript (ID: 5)
  { local: './exemplos/projeto_final.pdf', bucket: 'material5', name: 'projeto_final.pdf' },

  // Material 6: Introdução ao Python (ID: 6)
  { local: './exemplos/introducao_python.pdf', bucket: 'material6', name: 'introducao_python.pdf' },

  // Material 7: Estruturas de Controle (ID: 7)
  { local: './exemplos/estruturas_controle.mp4', bucket: 'material7', name: 'estruturas_controle.mp4' },

  // Material 8: Manipulação de Arquivos (ID: 8)
  { local: './exemplos/manipulacao_arquivos.pdf', bucket: 'material8', name: 'manipulacao_arquivos.pdf' },

  // Material 9: Projeto Python (ID: 9)
  { local: './exemplos/projeto_python.pdf', bucket: 'material9', name: 'projeto_python.pdf' },

  // Material 10: Introdução ao React (ID: 10)
  { local: './exemplos/introducao_react.pdf', bucket: 'material10', name: 'introducao_react.pdf' },

  // Material 11: Componentes React (ID: 11)
  { local: './exemplos/componentes_react.mp4', bucket: 'material11', name: 'componentes_react.mp4' },

  // Material 12: Hooks em React (ID: 12)
  { local: './exemplos/hooks_react.pdf', bucket: 'material12', name: 'hooks_react.pdf' },

  // Material 13: Projeto React (ID: 13)
  { local: './exemplos/projeto_react.pdf', bucket: 'material13', name: 'projeto_react.pdf' },
];

// Adicionar imagens dos colaboradores
for (let i = 1; i <= 10; i++) {
  files.push({
    local: `./exemplos/colaborador${i}.jpg`,
    bucket: `colaborador${i}`,
    name: `colaborador${i}.jpg`
  });
}

// Função para criar bucket se não existir
function ensureBucket(bucket) {
  return new Promise((resolve, reject) => {
    minioClient.bucketExists(bucket, function(err, exists) {
      if (err && err.code !== 'NoSuchBucket') return reject(err);
      if (exists) return resolve();
      minioClient.makeBucket(bucket, '', function(err) {
        if (err) return reject(err);
        console.log(`Bucket '${bucket}' criado.`);
        resolve();
      });
    });
  });
}

// Função para criar PDF dummy mínimo
function createDummyPDF(path) {
  // PDF mínimo válido
  const pdfContent = '%PDF-1.1\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF';
  fs.writeFileSync(path, pdfContent);
  console.log(`PDF dummy criado: ${path}`);
}

// Função para criar ZIP dummy mínimo
function createDummyZIP(path) {
  // ZIP mínimo válido
  const zipContent = Buffer.from('PK\x05\x06\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00');
  fs.writeFileSync(path, zipContent);
  console.log(`ZIP dummy criado: ${path}`);
}

async function uploadAll() {
  // Garantir que todos os buckets existem
  const buckets = [...new Set(files.map(f => f.bucket))];
  for (const bucket of buckets) {
    await ensureBucket(bucket);
  }

  // Fazer upload dos arquivos
  for (const file of files) {
    const ext = file.local.split('.').pop().toLowerCase();
    if (!fs.existsSync(file.local)) {
      if (ext === 'pdf') {
        createDummyPDF(file.local);
      } else if (ext === 'mp4') {
        console.warn(`Arquivo de vídeo não encontrado: ${file.local} (adicione um vídeo real para upload)`);
        continue;
      } else if (ext === 'zip') {
        createDummyZIP(file.local);
      } else {
        // Ignora outros tipos
        console.warn(`Tipo de arquivo não suportado: ${ext}`);
        continue;
      }
    }
    minioClient.fPutObject(file.bucket, file.name, file.local, function(err, etag) {
      if (err) return console.log(`Erro ao enviar ${file.name}:`, err);
      console.log(`Arquivo ${file.name} enviado com sucesso para o bucket ${file.bucket}!`);
    });
  }
}

uploadAll(); 