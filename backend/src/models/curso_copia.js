const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('curso_copia', {
    curso_copia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'curso',
        key: 'curso_id'
      }
    },
    parent_curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'curso',
        key: 'curso_id'
      }
    }
  }, {
    sequelize,
    tableName: 'curso_copia',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "curso_copia_pkey",
        unique: true,
        fields: [
          { name: "curso_copia_id" },
          { name: "parent_curso_id" },
        ]
      },
    ]
  });
};
