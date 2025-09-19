import { QueryInterface, QueryTypes } from "sequelize";
import { uuidv7 } from "uuidv7";

const UPDATED_BY = "seed:permission";

const PERMISSIONS = ["READ", "CREATE", "UPDATE", "DELETE", "BULK UPDATE"];

export async function up(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    // Find which permissions already exist (avoid duplicates if seeder is re-run)
    const existing = await queryInterface.sequelize.query<{ name: string }>(
      `
        SELECT name
        FROM permissions
        WHERE name IN (:names)
      `,
      {
        type: QueryTypes.SELECT,
        transaction: t,
        replacements: { names: PERMISSIONS },
      }
    );

    const existingNames = new Set(existing.map(row => row.name));

    const now = new Date();
    const rowsToInsert = PERMISSIONS
      .filter(name => !existingNames.has(name))
      .map(name => ({
        id: uuidv7(),
        name,
        updated_by: UPDATED_BY,
        created_at: now,
        updated_at: null,
        deleted_at: null,
      }));

    if (rowsToInsert.length > 0) {
      await queryInterface.bulkInsert("permissions", rowsToInsert, { transaction: t });
    }

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function down(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    // Remove only what this seeder inserted
    await queryInterface.bulkDelete(
      "permissions",
      { updated_by: UPDATED_BY },
      { transaction: t }
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
