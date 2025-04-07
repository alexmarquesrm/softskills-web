const initModels = require("../models/init-models");
const sequelizeConn = require("../bdConexao");
const models = initModels(sequelizeConn);

const controladorAreas = {
  // GET todas as áreas
  getAllAreas: async (req, res) => {
    try {
      const areas = await models.area.findAll({
        include: [{ model: models.categoria, as: "area_categoria" }]
      });
      res.json(areas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao obter áreas" });
    }
  },

  // GET área por ID
  getAreaById: async (req, res) => {
    try {
      const area = await models.area.findByPk(req.params.id, {
        include: [{ model: models.categoria, as: "area_categoria" }]
      });
      if (!area) {
        return res.status(404).json({ message: "Área não encontrada" });
      }
      res.json(area);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao obter área" });
    }
  },

  // POST nova área
  createArea: async (req, res) => {
    const { categoria_id, descricao } = req.body;
    try {
      const novaArea = await models.area.create({ categoria_id, descricao });
      res.status(201).json(novaArea);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar área" });
    }
  },

  // PUT atualizar área
  updateArea: async (req, res) => {
    const { id } = req.params;
    const { categoria_id, descricao } = req.body;
    try {
      const area = await models.area.findByPk(id);
      if (!area) {
        return res.status(404).json({ message: "Área não encontrada" });
      }
      await area.update({ categoria_id, descricao });
      res.json({ message: "Área atualizada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar área" });
    }
  },

  // DELETE apagar área
  deleteArea: async (req, res) => {
    const { id } = req.params;
    try {
      const area = await models.area.findByPk(id);
      if (!area) {
        return res.status(404).json({ message: "Área não encontrada" });
      }
      await area.destroy();
      res.json({ message: "Área apagada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar área" });
    }
  },
};

module.exports = controladorAreas;
