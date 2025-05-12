require("dotenv").config();
const { Sequelize } = require("sequelize");

const useSSL =
  process.env.PGSSLMODE === "require" || process.env.PGSSLMODE === "true";

const dialectOptions = useSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

function getConfig() {
  return {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    dialect: "postgres",
    pool: {
      max: parseInt(process.env.PGCONNECTIONLIMIT) || 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions,
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
