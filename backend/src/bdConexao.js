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
    host: process.env.PGHOST?.trim(),
    port: process.env.PGPORT?.trim(),
    username: process.env.PGUSER?.trim(),
    password: process.env.PGPASSWORD?.trim(),
    database: process.env.PGDATABASE?.trim(),
    dialect: "postgres",
    pool: {
      max: parseInt(process.env.PGCONNECTIONLIMIT) || 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions,
  };
}

const config = getConfig();

// Debug logging
// console.log('Database connection config:', {
//   host: config.host,
//   port: config.port,
//   username: config.username,
//   database: config.database,
// });

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
