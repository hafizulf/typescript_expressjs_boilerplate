import { QueryInterface } from "sequelize";

export async function up(q: QueryInterface) {
  await q.sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS roles_name_uidx ON roles(name);
  `);
}

export async function down(q: QueryInterface) {
  await q.sequelize.query(`
    DROP INDEX IF EXISTS roles_name_uidx;
  `);
}
