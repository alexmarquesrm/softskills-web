const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('respostas_quizz', {
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
    },
    questao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'questoes_quizz',
        key: 'questao_id'
      }
    },
    resposta: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'respostas_quizz',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_respostas_quizz",
        unique: true,
        fields: [
          { name: "formando_id" },
          { name: "questao_id" },
        ]
      },
    ]
  });
};
