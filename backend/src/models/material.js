const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('material', {
    material_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'curso',
        key: 'curso_id'
      }
    },
    titulo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tipo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    secao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data_entrega: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'material',
    schema: 'public',
    timestamps: false
  });
};
