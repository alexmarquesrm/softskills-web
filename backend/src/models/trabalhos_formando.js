const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const trabalhos_formando = sequelize.define('trabalhos_formando', {
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

  trabalhos_formando.associate = function(models) {
    trabalhos_formando.belongsTo(models.formando, {
      foreignKey: 'formando_id',
      as: 'formando'
    });
    trabalhos_formando.belongsTo(models.trabalho, {
      foreignKey: 'trabalho_id',
      as: 'trabalho'
    });
  };

  return trabalhos_formando;
};
