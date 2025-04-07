const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('avaliacao_quizz', {
    quizz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'quizz',
        key: 'quizz_id'
      }
    },
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
    },
    nota: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'avaliacao_quizz',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_avaliacao_quizz",
        unique: true,
        fields: [
          { name: "quizz_id" },
          { name: "formando_id" },
        ]
      },
    ]
  });
};
