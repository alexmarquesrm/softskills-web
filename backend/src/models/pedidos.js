const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pedidos', {
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    colaborador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colaborador',
        key: 'colaborador_id'
      }
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['CURSO', 'FORUM']]
      }
    },
    referencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'pedidos',
    schema: 'public',
    timestamps: false
  });
};