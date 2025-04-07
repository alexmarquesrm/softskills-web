const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('presenca_form_sinc', {
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
    },
    aula_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'aula',
        key: 'aula_id'
      }
    }
  }, {
    sequelize,
    tableName: 'presenca_form_sinc',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_presenca",
        unique: true,
        fields: [
          { name: "formando_id" },
          { name: "aula_id" },
        ]
      },
    ]
  });
};
