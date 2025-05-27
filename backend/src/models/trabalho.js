const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const trabalho = sequelize.define('trabalho', {
    trabalho_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sincrono_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sincrono',
        key: 'curso_id'
      }
    },
    formando_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'formando',
        key: 'formando_id'
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nota: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    data: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'trabalho',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_trabalho",
        unique: true,
        fields: [
          { name: "trabalho_id" },
        ]
      },
    ]
  });

  trabalho.associate = function(models) {
    trabalho.belongsTo(models.formando, {
      foreignKey: 'formando_id',
      as: 'formando'
    });
    trabalho.belongsTo(models.sincrono, {
      foreignKey: 'sincrono_id',
      as: 'sincrono'
    });
  };

  return trabalho;
};
