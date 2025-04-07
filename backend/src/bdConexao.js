require("dotenv").config();
const { Sequelize } = require("sequelize");

function getConfig() {
  return {
    host: process.env[`PGHOST`],
    port: process.env[`PGPORT`],
    username: process.env[`PGUSER`],
    password: process.env[`PGPASSWORD`],
    database: process.env[`PGDATABASE`],
    dialect: "postgres",
    pool: {
      max: parseInt(process.env[`PGCONNECTIONLIMIT`]) || 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
  };
}

const config = getConfig();

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

module.exports = sequelize;
