const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('opcoes_quizz', {
    opcao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    questao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questoes_quizz',
        key: 'questao_id'
      }
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    correta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'opcoes_quizz',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_opcoes_quizz",
        unique: true,
        fields: [
          { name: "opcao_id" },
        ]
      },
    ]
  });
}; 