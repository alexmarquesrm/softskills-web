const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inscricao', {
    inscricao_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'curso',
        key: 'curso_id'
      }
    },
    tipo_avaliacao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nota: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    data_certificado: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_inscricao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'inscricao',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_inscricao",
        unique: true,
        fields: [
          { name: "inscricao_id" },
        ]
      },
    ]
  });
};
