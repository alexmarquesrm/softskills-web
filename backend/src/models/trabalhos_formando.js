const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('trabalhos_formando', {
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
    },
    trabalho_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'trabalho',
        key: 'trabalho_id'
      }
    }
  }, {
    sequelize,
    tableName: 'trabalhos_formando',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_form_trab",
        unique: true,
        fields: [
          { name: "formando_id" },
          { name: "trabalho_id" },
        ]
      },
    ]
  });
};
