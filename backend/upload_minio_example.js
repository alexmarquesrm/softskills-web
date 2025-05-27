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

  // Cursos Síncronos
  { local: './exemplos/curso1_sincrono.jpg', bucket: 'curso1', name: 'curso1_sincrono.jpg' },
  { local: './exemplos/curso2_sincrono.jpg', bucket: 'curso2', name: 'curso2_sincrono.jpg' },
  { local: './exemplos/curso3_sincrono.jpg', bucket: 'curso3', name: 'curso3_sincrono.jpg' },
  { local: './exemplos/curso4_sincrono.jpg', bucket: 'curso4', name: 'curso4_sincrono.jpg' },
  { local: './exemplos/curso5_sincrono.jpg', bucket: 'curso5', name: 'curso5_sincrono.jpg' },

  // Cursos Assíncronos
  { local: './exemplos/curso22_assincrono.jpg', bucket: 'curso22', name: 'curso22_assincrono.jpg' },
  { local: './exemplos/curso23_assincrono.jpg', bucket: 'curso23', name: 'curso23_assincrono.jpg' },
  { local: './exemplos/curso24_assincrono.jpg', bucket: 'curso24', name: 'curso24_assincrono.jpg' },
  { local: './exemplos/curso25_assincrono.jpg', bucket: 'curso25', name: 'curso25_assincrono.jpg' },
  { local: './exemplos/curso26_assincrono.jpg', bucket: 'curso26', name: 'curso26_assincrono.jpg' }
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

// Função para criar imagem JPG dummy mínima (1x1 pixel)
function createDummyJPG(path) {
  // JPG mínimo válido (1x1 pixel preto)
  const jpgContent = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
    0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
    0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
    0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
    0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
    0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
    0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
    0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x00, 0xFF, 0xD9
  ]);
  fs.writeFileSync(path, jpgContent);
  console.log(`JPG dummy criado: ${path}`);
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
      } else if (ext === 'jpg') {
        createDummyJPG(file.local);
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