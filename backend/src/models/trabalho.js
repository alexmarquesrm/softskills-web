const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('trabalho', {
    trabalho_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sincrono_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sincrono',
        key: 'curso_id'
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nota: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    data: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'trabalho',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_trabalho",
        unique: true,
        fields: [
          { name: "trabalho_id" },
        ]
      },
    ]
  });
};
