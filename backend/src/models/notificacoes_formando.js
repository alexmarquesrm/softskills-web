const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notificacoes_formando', {
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
    },
    notificacao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'notificacao',
        key: 'notificacao_id'
      }
    }
  }, {
    sequelize,
    tableName: 'notificacoes_formando',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_notificacoes_formando",
        unique: true,
        fields: [
          { name: "formando_id" },
          { name: "notificacao_id" },
        ]
      },
    ]
  });
};
