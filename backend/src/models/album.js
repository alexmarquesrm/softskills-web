const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('album', {
    album_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    objeto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'objeto',
        key: 'objeto_id'
      }
    }
  }, {
    sequelize,
    tableName: 'album',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_album",
        unique: true,
        fields: [
          { name: "album_id" },
        ]
      },
    ]
  });
};
