const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FORUM', {
    forum_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    topico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'topico',
        key: 'topico_id'
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    aprovado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    pendente: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'forum',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "forum_pkey",
        unique: true,
        fields: [
          { name: "forum_id" },
        ]
      }
    ]
  });
};
