const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedido_curso', {
    formador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'formador',
        key: 'formador_id'
      }
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'curso',
        key: 'curso_id'
      }
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'pedido_curso',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_pedecurso",
        unique: true,
        fields: [
          { name: "formador_id" },
          { name: "curso_id" },
        ]
      },
    ]
  });
};
