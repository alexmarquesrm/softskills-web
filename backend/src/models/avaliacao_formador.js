const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('avaliacao_formador', {
    avaliacao_id: {
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
    formador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formador',
        key: 'formador_id'
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
    avaliacao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    data_avaliacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    tableName: 'avaliacao_formador',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "avaliacao_formador_pkey",
        unique: true,
        fields: [
          { name: "avaliacao_id" },
        ]
      },
      {
        name: "uk_avaliacao_formador_unique",
        unique: true,
        fields: [
          { name: "curso_id" },
          { name: "formador_id" },
          { name: "formando_id" },
        ]
      },
    ]
  });
}; 