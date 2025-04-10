const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('assincrono', {
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'curso',
        key: 'curso_id'
      }
    }
  }, {
    sequelize,
    tableName: 'assincrono',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_assincrono",
        unique: true,
        fields: [
          { name: "curso_id" },
        ]
      },
    ]
  });
};
