const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comentarios', {
    comentario_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    thread_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'threads',
        key: 'thread_id'
      }
    },
    colaborador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colaborador',
        key: 'colaborador_id'
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'comentarios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "comentarios_pkey",
        unique: true,
        fields: [
          { name: "comentario_id" },
        ]
      },
    ]
  });
};
