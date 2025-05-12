const express = require('express');
const router = express.Router();
const cursoMaterialController = require('../controllers/materiaisController');

// Rotas para materiais de curso
// GET - Listar todos os materiais de um curso
router.get('/curso/:cursoId/materiais', cursoMaterialController.getMaterials);

// POST - Adicionar novo material a um curso
router.post('/curso/:cursoId/materiais', cursoMaterialController.addMaterial);

// GET - Obter um material específico pelo ID
router.get('/curso/:id', cursoMaterialController.getMaterialById);

// PUT - Atualizar um material existente
router.put('/curso/material/:materialId', cursoMaterialController.updateMaterial);

// DELETE - Excluir um material
router.delete('/curso/material/:materialId', cursoMaterialController.deleteMaterial);

module.exports = router;