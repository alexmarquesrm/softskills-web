const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notificacao', {
    notificacao_id: {
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
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'notificacao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_notificacao",
        unique: true,
        fields: [
          { name: "notificacao_id" },
        ]
      },
    ]
  });
};
