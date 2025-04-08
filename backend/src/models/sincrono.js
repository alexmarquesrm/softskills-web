const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sincrono', {
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'curso',
        key: 'curso_id'
      }
    },
    formador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formador',
        key: 'formador_id'
      }
    },
    limite_vagas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_limite_inscricao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_fim: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sincrono',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_sincrono",
        unique: true,
        fields: [
          { name: "curso_id" },
        ]
      },
    ]
  });
};
