const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gestor', {
    gestor_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'colaborador',
        key: 'colaborador_id'
      }
    }
  }, {
    sequelize,
    tableName: 'gestor',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_gestor",
        unique: true,
        fields: [
          { name: "gestor_id" },
        ]
      },
    ]
  });
};
