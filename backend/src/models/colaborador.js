const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('colaborador', {
    colaborador_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "colaborador_email_key"
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "colaborador_username_key"
    },
    pssword: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_nasc: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    cargo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    departamento: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    telefone: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      unique: "colaborador_telefone_key"
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'colaborador',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "colaborador_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "colaborador_telefone_key",
        unique: true,
        fields: [
          { name: "telefone" },
        ]
      },
      {
        name: "colaborador_username_key",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "pk_colab",
        unique: true,
        fields: [
          { name: "colaborador_id" },
        ]
      },
    ]
  });
};
