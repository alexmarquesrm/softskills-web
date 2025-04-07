const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('credenciais', {
    credencial_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    colaborador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colaborador',
        key: 'colaborador_id'
      }
    },
    login: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "credenciais_login_key"
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'credenciais',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "credenciais_login_key",
        unique: true,
        fields: [
          { name: "login" },
        ]
      },
      {
        name: "pk_credenciais",
        unique: true,
        fields: [
          { name: "credencial_id" },
        ]
      },
    ]
  });
};
