const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorCategorias = {
  // Criar nova categoria
  createCategoria: async (req, res) => {
    const { descricao } = req.body;

    try {
      const novaCategoria = await models.categoria.create({ descricao });
      res.status(201).json(novaCategoria);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar categoria" });
    }
  },

  // Obter todas as categorias
  getAllCategorias: async (req, res) => {
    try {
      const categorias = await models.categoria.findAll();
      res.json(categorias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar categorias" });
    }
  },

  // Obter uma categoria por ID
  getCategoriaById: async (req, res) => {
    const { id } = req.params;

    try {
      const categoria = await models.categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
      res.json(categoria);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar categoria" });
    }
  },

  // Atualizar uma categoria
  updateCategoria: async (req, res) => {
    const { id } = req.params;
    const { descricao } = req.body;

    try {
      const categoria = await models.categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      await categoria.update({ descricao });
      res.json({ message: "Categoria atualizada com sucesso", categoria });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar categoria" });
    }
  },

  // Apagar uma categoria
  deleteCategoria: async (req, res) => {
    const { id } = req.params;

    try {
      const categoria = await models.categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }

      await categoria.destroy();
      res.json({ message: "Categoria apagada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar categoria" });
    }
  },
};

module.exports = controladorCategorias;
