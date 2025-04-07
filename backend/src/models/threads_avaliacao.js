const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('threads_avaliacao', {
    thread_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'threads',
        key: 'thread_id'
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
    vote: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'threads_avaliacao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_thread_avaliacao",
        unique: true,
        fields: [
          { name: "thread_id" },
          { name: "formando_id" },
        ]
      },
    ]
  });
};
