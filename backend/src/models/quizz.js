const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quizz', {
    quizz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'curso',
        key: 'curso_id'
      }
    },
    gestor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'gestor',
        key: 'gestor_id'
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nota: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 70.0
    }
  }, {
    sequelize,
    tableName: 'quizz',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_quizz",
        unique: true,
        fields: [
          { name: "quizz_id" },
        ]
      },
    ]
  });
};
