const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('curso', {
    curso_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    gestor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'gestor',
        key: 'gestor_id'
      }
    },
    topico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'topico',
        key: 'topico_id'
      }
    },
    tipo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    total_horas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    aprovado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    pendente: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    certificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    nivel: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'curso',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "curso_pkey",
        unique: true,
        fields: [
          { name: "curso_id" },
        ]
      },
    ]
  });
};
