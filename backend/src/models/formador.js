const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('formador', {
    formador_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'colaborador',
        key: 'colaborador_id'
      }
    },
    especialidade: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'formador',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_formador",
        unique: true,
        fields: [
          { name: "formador_id" },
        ]
      },
    ]
  });
};
