const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('denuncias', {
    denuncia_id: {
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
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'denuncias',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_thread_denuncias",
        unique: true,
        fields: [
          { name: "denuncia_id" },
        ]
      },
    ]
  });
};
