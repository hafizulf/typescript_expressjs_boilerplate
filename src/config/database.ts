import { DB_CONFIG } from "./env";
import { Dialect, Sequelize } from "sequelize";

const { db_name, db_user, db_password } = DB_CONFIG;
const sequelize = new Sequelize(db_name, db_user, db_password, {
  dialect: <Dialect>DB_CONFIG.config.dialect,
  host: DB_CONFIG.config.host,
  port: parseInt(DB_CONFIG.config.port),
  logging: console.log,
});

export { Sequelize, sequelize };
