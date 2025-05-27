const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('funcao', {
    funcao_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    departamento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'departamento',
        key: 'departamento_id'
      }
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'funcao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_funcao",
        unique: true,
        fields: [
          { name: "funcao_id" },
        ]
      },
    ]
  });
}; 