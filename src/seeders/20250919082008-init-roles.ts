import { QueryInterface } from "sequelize";

// hardcoded once, so other seeders can reference it
const SUPERADMIN_ID = "018f47bc-1111-7777-b111-111111111111";

export async function up(queryInterface: QueryInterface) {
  const t = await queryInterface.sequelize.transaction();
  try {
    const now = new Date();

    const [results] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE id = :id OR name = :name`,
      {
        replacements: { id: SUPERADMIN_ID, name: "superadmin" },
        transaction: t,
      }
    );

    if ((results as any[]).length === 0) {
      await queryInterface.bulkInsert(
        "roles",
        [
          {
            id: SUPERADMIN_ID, // fixed for consistency
            name: "superadmin",
            created_at: now,
            updated_at: now,
            deleted_at: null,
          },
        ],
        { transaction: t }
      );
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
    await queryInterface.bulkDelete(
      "roles",
      { id: SUPERADMIN_ID },
      { transaction: t }
    );
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
