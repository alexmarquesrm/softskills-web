const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('threads', {
    thread_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    forum_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'forum',
        key: 'forum_id'
      }
    },
    colaborador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colaborador',
        key: 'colaborador_id'
      }
    },
    titulo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'threads',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "threads_pkey",
        unique: true,
        fields: [
          { name: "thread_id" },
        ]
      },
    ]
  });
};
