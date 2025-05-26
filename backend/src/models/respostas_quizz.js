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
    opcao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'opcoes_quizz',
        key: 'opcao_id'
      }
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
