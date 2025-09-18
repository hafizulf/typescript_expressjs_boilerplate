require("dotenv").config();

const common = {
  username: process.env.DB_MIGRATE_USER,
  password: process.env.DB_MIGRATE_PASSWORD,
  database: process.env.DB_MIGRATE_NAME,
  host: process.env.DB_MIGRATE_HOST,
  port: Number(process.env.DB_MIGRATE_PORT || 5432),
  dialect: "postgres",
  logging: false,
};

module.exports = {
  development: { ...common },
  test: { ...common, database: process.env.DB_MIGRATE_DATABASE_TEST || "typescript_expressjs_boilerplate_test" },
  production: { ...common },
};
