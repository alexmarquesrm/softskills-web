const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('objeto', {
    objeto_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    registo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uk_registo_entidade"
    },
    entidade: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "uk_registo_entidade"
    }
  }, {
    sequelize,
    tableName: 'objeto',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_objeto",
        unique: true,
        fields: [
          { name: "objeto_id" },
        ]
      },
      {
        name: "uk_registo_entidade",
        unique: true,
        fields: [
          { name: "registo_id" },
          { name: "entidade" },
        ]
      },
    ]
  });
};
