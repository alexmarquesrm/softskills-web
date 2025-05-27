const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notificacao', {
    notificacao_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
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
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    lida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
