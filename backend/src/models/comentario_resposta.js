const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comentario_resposta', {
    resposta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'comentarios',
        key: 'comentario_id'
      }
    },
    comentariopai_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'comentarios',
        key: 'comentario_id'
      }
    }
  }, {
    sequelize,
    tableName: 'comentario_resposta',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "comentario_resposta_pkey",
        unique: true,
        fields: [
          { name: "resposta_id" },
          { name: "comentariopai_id" },
        ]
      },
    ]
  });
};
