const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('aula', {
    aula_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    formador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formador',
        key: 'formador_id'
      }
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
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hora_fim: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'aula',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_aula",
        unique: true,
        fields: [
          { name: "aula_id" },
        ]
      },
    ]
  });
};
