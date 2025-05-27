const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('departamento', {
    departamento_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'departamento',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_departamento",
        unique: true,
        fields: [
          { name: "departamento_id" },
        ]
      },
    ]
  });
}; 