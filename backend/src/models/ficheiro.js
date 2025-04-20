const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ficheiro', {
    ficheiro_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    objeto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'objeto',
        key: 'objeto_id'
      }
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    extensao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tamanho: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    data_alteracao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'ficheiro',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_ficheiro",
        unique: true,
        fields: [
          { name: "ficheiro_id" },
        ]
      },
    ]
  });
};
