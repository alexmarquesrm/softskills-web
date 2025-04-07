const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('anexo', {
    anexo_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'album',
        key: 'album_id'
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'anexo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_anexo",
        unique: true,
        fields: [
          { name: "anexo_id" },
        ]
      },
    ]
  });
};
