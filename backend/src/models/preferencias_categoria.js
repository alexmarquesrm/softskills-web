const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('preferencias_categoria', {
    preferencia_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
    },
    designacao: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'preferencias_categoria',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_preferencias",
        unique: true,
        fields: [
          { name: "preferencia_id" },
        ]
      },
    ]
  });
};
