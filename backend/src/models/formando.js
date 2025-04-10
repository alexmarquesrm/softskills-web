const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('formando', {
    formando_id: {
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
    tableName: 'formando',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_formando",
        unique: true,
        fields: [
          { name: "formando_id" },
        ]
      },
    ]
  });
};
