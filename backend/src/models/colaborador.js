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
      unique: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    pssword: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_nasc: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    funcao_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'funcao',
        key: 'funcao_id'
      }
    },
    telefone: {
      type: DataTypes.DECIMAL(9,0),
      allowNull: false,
      unique: true
    },
    sobre_mim: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    inativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    google_id: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true
    }
    ,
    fcmtoken: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'colaborador',
    schema: 'public',
    timestamps: false,
    indexes: [
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
