const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('questoes_quizz', {
    questao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    quizz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quizz',
        key: 'quizz_id'
      }
    },
    pergunta: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'questoes_quizz',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_questoes_quizz",
        unique: true,
        fields: [
          { name: "questao_id" },
        ]
      },
    ]
  });
};
