const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('topico', {
    topico_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'area',
        key: 'area_id'
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'topico',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_topico",
        unique: true,
        fields: [
          { name: "topico_id" },
        ]
      },
    ]
  });
};
